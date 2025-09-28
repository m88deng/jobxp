import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { type JobApplication } from "../types";
import { StyledDashboard, StyledTable } from "../styles/StyledPage";
import DashboardHeader from "../components/DashboardHeader";
import NewApplicationModal from "../components/ApplicationModal";
import ApplicationsTable from "../components/ApplicationTable";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "applications"),
      orderBy("company")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const apps: JobApplication[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as JobApplication),
      }));
      setApplications(apps);
    });
    return unsub;
  }, [user]);

  const addApplication = async () => {
    if (!company.trim() || !position.trim() || !user) return;
    const newApp: JobApplication = {
      company: company.trim(),
      position: position.trim(),
      dateApplied: new Date().toISOString().split("T")[0],
      salary: "",
      location: "",
      keySkills: [],
      dailyResponsibilities: [],
      companyDescription: "",
      rawText: "",
      status: "Applied",
    };
    try {
      await addDoc(collection(db, "users", user.uid, "applications"), newApp);
      setCompany("");
      setPosition("");
    } catch (err) {
      console.error("Error adding application:", err);
    }
  };

  return (
    <>
      <StyledDashboard>
        <DashboardHeader
          title="My Dashboard"
          onNewClick={() => setIsModalOpen(true)}
        />
        <NewApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onResult={async (parsedData) => {
            if (!user) return;
            try {
              await addDoc(collection(db, "users", user.uid, "applications"), {
                company: parsedData.company || "",
                position: parsedData.position || "",
                dateApplied:
                  parsedData.dateApplied ||
                  new Date().toISOString().split("T")[0],
                salary: parsedData.salary || "",
                location: parsedData.location || "",
                keySkills: parsedData.keySkills || [],
                dailyResponsibilities: parsedData.dailyResponsibilities || [],
                companyDescription: parsedData.companyDescription || "",
                rawText: parsedData.rawText || "",
                status: "Applied",
              });
            } catch (err) {
              console.error("Failed to save parsed application:", err);
            }
          }}
        />

        {/* Add Application Form */}
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <input
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={addApplication}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add
            </button>
          </div>
        </div>
      </StyledDashboard>
      {/* Render Applications Table */}
      <StyledTable>
        <ApplicationsTable
          applications={applications}
          userId={user?.uid}
          onEdit={(application) => {
            // For now, you can just open the modal pre-filled or log it
            console.log("Edit clicked:", application);

            // Example: open modal with pre-filled data
            setIsModalOpen(true);
            // optionally store the application in state if your modal supports editing
          }}
        />
      </StyledTable>
    </>
  );
}
