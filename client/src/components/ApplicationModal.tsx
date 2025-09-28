import { useState } from "react";
import { Overlay, ModalContainer, CloseButton, ModalHeader, ModalBody, SectionHeader, SectionContent, TextArea } from "../styles/StyledModal";
import { parseWithGemini } from "../api/parse";

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (data: any) => void; // callback for the parsed data
}

export default function NewApplicationModal({
  isOpen,
  onClose,
  onResult,
}: NewApplicationModalProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCreate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Always treat input as text
      const result = await parseWithGemini(input.trim());
      onResult(result); // send parsed data back to parent
      setInput("");       // reset textarea
      onClose();          // close modal
    } catch (err) {
      console.error("Error parsing input:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={handleContainerClick}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>
          <div>New Application</div>
        </ModalHeader>
        <ModalBody>
          <SectionHeader>
            Job Description
          </SectionHeader>
          <SectionContent $collapsed={false}>
            <TextArea
              placeholder="Paste the job description here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleCreate} disabled={loading}>
              {loading ? "Processing..." : "Parse"}
            </button>
          </SectionContent>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
}
