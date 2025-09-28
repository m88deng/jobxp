import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

export const ModalContainer = styled.div`
  background: var(--color-background);
  border-radius: 12px;
  color: var(--color-foreground);
  min-height: 300px;
  width: 88%;
  max-width: 1024px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
`;

export const ModalHeader = styled.div`
  padding: 2.25rem 1.5rem 0.5rem;
  font-weight: bold;
  font-size: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const ModalBody = styled.div`
  padding: 1rem 1.5rem 2rem;
`;

export const SectionHeader = styled.div<{ $collapsed?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  /*border-bottom: 1px solid #e5e7eb;*/
`;

export const SectionContent = styled.div<{ $collapsed: boolean }>`
  max-height: ${(props) => (props.$collapsed ? "0" : "200px")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${(props) => (props.$collapsed ? "0" : "0.5rem 0")};
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  resize: none;
  border: 1px solid var(--color-foreground);
  border-radius: 0.375rem;
  padding: 0.5rem;
  box-sizing: border-box;
`;

export const CloseButton = styled.button`
  position: absolute;
  right: 0px;
  background: transparent;
  border: none;
  font-size: 1rem;
  color: var(--color-secondary)
  font-weight: bold;
  cursor: pointer;
  padding: 0.5rem 0.75rem;

  &:hover {
    background: transparent;
    color: #ef4444;
  }
`;
