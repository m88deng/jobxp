import { useState } from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  ModalHeader,
  ModalBody,
  SectionHeader,
  SectionContent,
} from "../styles/StyledModal";
import { type JobApplication } from "../types";

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplication | null;
}

export default function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
}: ApplicationDetailModalProps) {
  const [showRaw, setShowRaw] = useState(false);

  if (!isOpen || !application) return null;

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={handleContainerClick}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>
          <div>
            {application.position} @ {application.company}
          </div>
        </ModalHeader>
        <ModalBody>
          <SectionHeader>Details</SectionHeader>
          <SectionContent $collapsed={false}>
            <p><strong>Date Applied:</strong> {application.dateApplied}</p>
            <p><strong>Location:</strong> {application.location}</p>
            <p><strong>Salary:</strong> {application.salary}</p>
            <p><strong>Status:</strong> {application.status}</p>
          </SectionContent>

          <SectionHeader>
            <button onClick={() => setShowRaw((p) => !p)}>
              {showRaw ? "Hide Job Description" : "Show Job Description"}
            </button>
          </SectionHeader>
          {showRaw && (
            <SectionContent $collapsed={false}>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {application.rawText || "No job description available"}
              </pre>
            </SectionContent>
          )}
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
}
