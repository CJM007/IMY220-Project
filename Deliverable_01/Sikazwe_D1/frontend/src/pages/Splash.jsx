import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login";
import SignupForm from "../components/SignupForm";

function Splash() {
  const [activeTab, setActiveTab] = useState("login");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  function handleLogin(formData) {
    sse
    console.log("Login submitted:", formData);
    navigate("/home");
  }

  function handleSignup(formData) {
    console.log("Signup submitted:", formData);
    navigate("/home");
  }

  return (
    <div className="splash-page">
      <h1>Dog-Eared</h1>
      <p>Share the books on your nightstand.</p>

      <div className="auth-card">
        <div className="tabs">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Log in
          </button>
          <button
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => setActiveTab("signup")}
          >
            Sign up
          </button>
        </div>

        {activeTab === "login" ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <SignupForm onSignup={handleSignup} />
        )}
      </div>
    </div>
  );
}

export default Splash;
