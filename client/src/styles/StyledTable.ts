import styled from "styled-components";

export const DeleteAppButton = styled.button`
  background: transparent;
  font-size: 1rem;
  color: var(--color-foreground);
  border: none;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    color: #ef4444;
    background: transparent;
  }
`;

export const TableRow = styled.tr`
  position: relative;

  &::before {
    content: "";
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: -1.5rem; /* adjust as needed */
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }
`;
