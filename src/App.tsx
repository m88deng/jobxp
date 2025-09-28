import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Hero from "./pages/HeroPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import RequireAuth from "./auth/RequireAuth";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Hero />} />

          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
