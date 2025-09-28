import { useState, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";

import { type JobApplication } from "../types";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import ApplicationDetailModal from "./ApplicationDetailModal";

// --- Props ---
interface ApplicationsTableProps {
  applications: JobApplication[];
  userId: string | undefined;
  onEdit: (application: JobApplication) => void;
}

// --- Actions Container ---
const ActionsContainer = styled("div")({
  display: "flex",
  gap: "8px",
  position: "absolute",
  left: "-28px",
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0,
  transition: "opacity 0.2s ease-in-out",
  ".MuiTableRow-root:hover &": {
    opacity: 1,
  },
});

type ColKey =
  | "dateApplied"
  | "company"
  | "position"
  | "location"
  | "salary"
  | "status";

const initialWidths: Record<ColKey, number> = {
  dateApplied: 140,
  company: 180,
  position: 180,
  location: 140,
  salary: 120,
  status: 120,
};

export default function ApplicationsTable({
  applications,
  userId,
  onEdit,
}: ApplicationsTableProps) {
  const storedWidths = userId
    ? localStorage.getItem(`appTableWidths_${userId}`)
    : null;

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [filters, setFilters] = useState({
    company: "",
    position: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: ColKey;
    direction: "asc" | "desc";
  } | null>(null);
  const [widths, setWidths] = useState<Record<ColKey, number>>(
    storedWidths ? JSON.parse(storedWidths) : initialWidths
  );

  const resizingCol = useRef<ColKey | null>(null);

  // --- Handlers ---
  const handleFilterChange = (field: keyof typeof filters, value: string) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const handleSort = (key: ColKey) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        // First click → ascending
        return { key, direction: "asc" };
      } else if (prev.direction === "asc") {
        // Second click → descending
        return { key, direction: "desc" };
      } else {
        // Third click → cancel sorting
        return null;
      }
    });
  };

  const handleRowClick = (app: JobApplication) => {
    setSelectedApp(app);
    setDetailOpen(true);
  };

  const deleteApplication = async (id: string) => {
    if (!userId) return;
    if (window.confirm("Are you sure you want to delete this application?")) {
      await deleteDoc(doc(db, "users", userId, "applications", id));
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!userId) return;
    await updateDoc(doc(db, "users", userId, "applications", id), { status });
  };

  // --- Resizing logic ---
  const handleMouseDown = (col: ColKey) => (e: React.MouseEvent) => {
    resizingCol.current = col;
    const startX = e.clientX;
    const startWidth = widths[col];

    const onMouseMove = (e: MouseEvent) => {
      if (!resizingCol.current) return;
      const newWidth = Math.max(startWidth + e.clientX - startX, 60);
      setWidths((prev) => {
        const updated = { ...prev, [resizingCol.current!]: newWidth };
        localStorage.setItem("appTableWidths", JSON.stringify(updated));
        if (userId) {
          localStorage.setItem(
            `appTableWidths_${userId}`,
            JSON.stringify(updated)
          );
        }
        return updated;
      });
    };

    const onMouseUp = () => {
      resizingCol.current = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // --- Filter & sort ---
  const filteredApplications = applications.filter(
    (a) =>
      (!filters.company ||
        a.company.toLowerCase().includes(filters.company.toLowerCase())) &&
      (!filters.position ||
        a.position.toLowerCase().includes(filters.position.toLowerCase())) &&
      (!filters.status ||
        a.status.toLowerCase() === filters.status.toLowerCase())
  );

  /* 
  const sortedApplications = sortConfig
    ? [...filteredApplications].sort((a, b) => {
        const { key, direction } = sortConfig;
        const valA = (a as any)[key] ?? "";
        const valB = (b as any)[key] ?? "";
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      })
    : filteredApplications; // if no sorting, keep original order*/

  const sortedApplications = sortConfig
    ? [...filteredApplications].sort((a, b) => {
        const { key, direction } = sortConfig;
        let valA = (a as any)[key] ?? "";
        let valB = (b as any)[key] ?? "";

        // special handling for dates
        if (key === "dateApplied") {
          console.log(valA, valB);
          valA = valA ? new Date(valA + "T00:00:00").getTime() : 0;
          valB = valB ? new Date(valB + "T00:00:00").getTime() : 0;
          console.log(valA, valB);
        }

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      })
    : filteredApplications;

  return (
    <TableContainer
      component={Paper}
      sx={{
        overflowX: "auto",
        marginX: "10%",
        width: Object.values(widths).reduce((a, b) => a + b, 0),
      }}
    >
      <Table
        sx={{ width: Object.values(widths).reduce((a, b) => a + b, 0) }}
        aria-label="job applications table"
      >
        <TableHead>
          {/* Header row */}
          <TableRow>
            {(
              [
                { key: "dateApplied", label: "Date Applied" },
                { key: "company", label: "Company" },
                { key: "position", label: "Position" },
                { key: "location", label: "Location" },
                { key: "salary", label: "Salary" },
                { key: "status", label: "Status" },
              ] as const
            ).map((col) => (
              <TableCell
                key={col.key}
                sx={{
                  width: widths[col.key],
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortConfig?.key === col.key && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                )}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(col.key)(e);
                  }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 5,
                    cursor: "col-resize",
                  }}
                />
              </TableCell>
            ))}
          </TableRow>

          {/* Filter row */}
          <TableRow>
            <TableCell />
            <TableCell>
              <TextField
                size="small"
                placeholder="Filter company"
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <TextField
                size="small"
                placeholder="Filter position"
                value={filters.position}
                onChange={(e) => handleFilterChange("position", e.target.value)}
              />
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
              <TextField
                select
                size="small"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                slotProps={{ select: { displayEmpty: true } }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="applied">Applied</MenuItem>
                <MenuItem value="interview">Interview</MenuItem>
                <MenuItem value="offer">Offer</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Table body */}
        <TableBody>
          {sortedApplications.map((a) => (
            <TableRow key={a.id} hover onClick={() => handleRowClick(a)}>
              <TableCell sx={{ width: widths.dateApplied }}>
                {a.dateApplied || "-"}
              </TableCell>
              <TableCell sx={{ width: widths.company }}>
                {a.company || "-"}
              </TableCell>
              <TableCell sx={{ width: widths.position }}>
                {a.position || "-"}
              </TableCell>
              <TableCell sx={{ width: widths.location }}>
                {a.location || "-"}
              </TableCell>
              <TableCell sx={{ width: widths.salary }}>
                {a.salary || "-"}
              </TableCell>
              <TableCell sx={{ width: widths.status }}>
                {a.status || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ApplicationDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        application={selectedApp}
      />

      {applications.length === 0 && (
        <p style={{ padding: "16px", color: "#6b7280" }}>
          No applications yet. Add your first one!
        </p>
      )}
    </TableContainer>
  );
}
