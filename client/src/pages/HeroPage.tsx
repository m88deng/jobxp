import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { StyledPage } from "../styles/StyledPage";

export default function HeroPage() {
  const { user, logout } = useAuth();

  return (
    <StyledPage>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
          <h1 className="text-xl font-bold">JobXP</h1>
          <div className="space-x-4">
            {user ? (
              <>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col flex-grow items-center justify-center text-center px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Track Your Job Applications Easily
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Stay organized, track your job applications, and never miss an
            opportunity. Your career journey starts here.
          </p>

          {user ? (
            <Link
              to="/home"
              className="px-6 py-3 rounded-lg bg-green-500 text-white text-lg hover:bg-green-600"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/signup"
              className="px-6 py-3 rounded-lg bg-blue-500 text-white text-lg hover:bg-blue-600"
            >
              Get Started
            </Link>
          )}
        </main>
      </div>
    </StyledPage>
  );
}
