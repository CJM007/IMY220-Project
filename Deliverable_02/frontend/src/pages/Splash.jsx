import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login";
import SignupForm from "../components/SignupForm";
import { signIn, signUp, setCurrentUser } from "../api";

function Splash() {
  const [activeTab, setActiveTab] = useState("login");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(formData) {
    setServerError("");
    try {
      const data = await signIn(formData.email, formData.password);
      setCurrentUser(data.user);
      navigate("/home");
    } catch (err) {
      setServerError(err.message);
    }
  }

  async function handleSignup(formData) {
    setServerError("");
    try {
      const data = await signUp({
        username: formData.username,
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setCurrentUser(data.user);
      navigate("/home");
    } catch (err) {
      setServerError(err.message);
    }
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

        {serverError && <p className="error-text">{serverError}</p>}

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
