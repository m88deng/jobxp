import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { StyledPage } from "../styles/StyledPage";
import DashboardHeader from "../components/DashboardHeader";
import Tag from "../components/Tags";
import NewApplicationModal from "../components/ApplicationModal";

interface JobApplication {
  id?: string;
  company: string;
  position: string;
  status: string;
  customFields?: Record<string, string>;
}

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  // Track new custom fields inputs dynamically
  const [newCustomKey, setNewCustomKey] = useState("");
  const [newCustomValue, setNewCustomValue] = useState("");

  // Real-time listener for applications
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
    try {
      await addDoc(collection(db, "users", user.uid, "applications"), {
        company: company.trim(),
        position: position.trim(),
        status: "Applied",
        customFields: { ...customFields },
      });
      setCompany("");
      setPosition("");
      setCustomFields({});
    } catch (err) {
      console.error("Error adding application:", err);
    }
  };

  const addCustomField = () => {
    if (!newCustomKey.trim()) return;
    setCustomFields((prev) => ({
      ...prev,
      [newCustomKey.trim()]: newCustomValue.trim(),
    }));
    setNewCustomKey("");
    setNewCustomValue("");
  };

  const updateStatus = async (id: string, status: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "applications", id);
    await updateDoc(docRef, { status });
  };

  const deleteApplication = async (id: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "applications", id);
    await deleteDoc(docRef);
  };

  // Compute all custom field keys to generate table columns
  const allCustomKeys = Array.from(
    new Set(applications.flatMap((a) => Object.keys(a.customFields || {})))
  );

  const getColorForTag = (content: string) => {
    const normalized = content.toLowerCase();
    if (normalized.includes("developer")) return "blue";
    if (normalized.includes("engineering")) return "pink";
    if (normalized.includes("waterloo") || normalized.includes("toronto"))
      return "yellow";
    if (normalized.includes("hybrid") || normalized.includes("in person"))
      return "orange";
    if (normalized === "applied") return "yellow";
    if (normalized === "interview") return "blue";
    return "gray";
  };
  
  function getDate(app: JobApplication) {
    // Assuming the date is stored in customFields.Date as "YYYY-MM-DD"
    return app.customFields?.Date || "-";
  }

  return (
    <StyledPage>
      <DashboardHeader
        title="My Dashboard"
        onNewClick={() => setIsModalOpen(true)}
      />

      <NewApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

        {/* Custom Fields Inputs */}
        <div className="flex gap-2 mt-2">
          <input
            placeholder="Custom field key"
            value={newCustomKey}
            onChange={(e) => setNewCustomKey(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            placeholder="Value"
            value={newCustomValue}
            onChange={(e) => setNewCustomValue(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={addCustomField}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Field
          </button>
        </div>
      </div>
      {/* Applications Table */}
      <div className="w-full overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-3 py-2 whitespace-nowrap w-24">Due</th>
              <th className="px-3 py-2 whitespace-nowrap w-48">Company</th>
              <th className="px-3 py-2 whitespace-nowrap">Position</th>
              <th className="px-3 py-2 whitespace-nowrap">Location</th>
              <th className="px-3 py-2 whitespace-nowrap">Work Type</th>
              <th className="px-3 py-2 whitespace-nowrap">Found</th>
              <th className="px-3 py-2 whitespace-nowrap w-40">Result</th>
              <th className="px-3 py-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {applications.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                {/* Due Date (Assuming you add a Date field to customFields) */}
                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                  {a.customFields?.Date ? getDate(a) : "-"}
                </td>

                {/* Company */}
                <td className="px-3 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {a.company}
                </td>

                {/* Position (Styled with Tag) */}
                <td className="px-3 py-2 text-sm whitespace-nowrap">
                  <Tag color={getColorForTag(a.position)}>{a.position}</Tag>
                </td>

                {/* Location (Multiple Tags from a comma-separated customField) */}
                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                  {a.customFields?.Location?.split(",")
                    .map((loc) => loc.trim())
                    .filter((loc) => loc)
                    .map((loc, i) => (
                      <Tag key={i} color={getColorForTag(loc)}>
                        {loc}
                      </Tag>
                    ))}
                </td>

                {/* Work Type (Multiple Tags from a comma-separated customField) */}
                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                  {a.customFields?.["Work Type"]
                    ?.split(",")
                    .map((type) => type.trim())
                    .filter((type) => type)
                    .map((type, i) => (
                      <Tag key={i} color={getColorForTag(type)}>
                        {type}
                      </Tag>
                    ))}
                </td>

                {/* Found */}
                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                  {a.customFields?.Found?.split(",")
                    .map((found) => found.trim())
                    .filter((found) => found)
                    .map((found, i) => (
                      <Tag key={i} color={getColorForTag(found)}>
                        {found}
                      </Tag>
                    ))}
                </td>

                {/* Result/Status (Multiple Tags based on current status and history) */}
                <td className="px-3 py-2 text-sm whitespace-nowrap">
                  <div className="flex flex-wrap">
                    {/* The status is now managed by a dropdown, let's just display the status */}
                    <Tag color={getColorForTag(a.status)}>{a.status}</Tag>
                    {/* To show multiple results (like Interview, OA, Applied), you'd need a history array, but for now we'll just show the current status */}
                    {a.customFields?.ResultHistory?.split(",") // Placeholder for showing multiple results
                      .map((res) => res.trim())
                      .filter((res) => res && res !== a.status)
                      .map((res, i) => (
                        <Tag key={i} color={getColorForTag(res)}>
                          {res}
                        </Tag>
                      ))}
                  </div>
                </td>

                {/* Actions (Update Status is now separate, Delete is here) */}
                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => deleteApplication(a.id!)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {applications.length === 0 && (
        <p className="mt-4 text-gray-500">
          No applications yet. Add your first one!
        </p>
      )}
    </StyledPage>
  );
}
