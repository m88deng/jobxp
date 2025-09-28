import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../auth/AuthProvider";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TitleLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #111827; // dark text
  &:hover {
    color: #3b82f6; // blue on hover
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserEmail = styled.span`
  font-size: 0.875rem;
  color: #4b5563; // gray
`;

const ButtonLink = styled(Link)<{ variant?: "primary" | "secondary" | "danger" | "success" }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;

  background-color: ${(props) =>
    props.variant === "primary"
      ? "#3b82f6"
      : props.variant === "danger"
      ? "#ef4444"
      : props.variant === "success"
      ? "#10b981"
      : "transparent"};
  color: ${(props) =>
    props.variant === "secondary" ? "#374151" : "#ffffff"};

  border: ${(props) =>
    props.variant === "secondary" ? "1px solid #d1d5db" : "none"};

  &:hover {
    background-color: ${(props) =>
      props.variant === "primary"
        ? "#2563eb"
        : props.variant === "danger"
        ? "#dc2626"
        : props.variant === "success"
        ? "#059669"
        : "#f3f4f6"};
    color: ${(props) =>
      props.variant === "secondary" ? "#111827" : "#ffffff"};
  }
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ef4444;
  color: #ef4444;
  background-color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #fee2e2;
  }
`;

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <HeaderWrapper>
      <TitleLink to="/">JobXP</TitleLink>
      <ButtonGroup>
        {user ? (
          <>
            <UserEmail>{user.email}</UserEmail>
            <ButtonLink to="/home" variant="success">
              Dashboard
            </ButtonLink>
            <LogoutButton onClick={logout}>Logout</LogoutButton>
          </>
        ) : (
          <>
            <ButtonLink to="/login" variant="secondary">
              Login
            </ButtonLink>
            <ButtonLink to="/signup" variant="primary">
              Signup
            </ButtonLink>
          </>
        )}
      </ButtonGroup>
    </HeaderWrapper>
  );
}
