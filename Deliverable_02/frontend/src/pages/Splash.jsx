import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import SignupForm from "../components/SignupForm.jsx";
import { signIn, signUp } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

// Bonus: parallax scrolling effect on the splash/landing page. Three
// background layers (sky, hills, books) move at different rates as
// the page scrolls, giving a sense of depth.
function useParallax() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollY;
}

export default function Splash() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const scrollY = useParallax();
  const formRef = useRef(null);

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  async function handleLogin(fields) {
    setError("");
    setPending(true);
    try {
      const data = await signIn(fields);
      setUser(data.user);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  async function handleSignup(fields) {
    setError("");
    setPending(true);
    try {
      const data = await signUp(fields);
      setUser(data.user);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative overflow-x-hidden">
      <div className="relative h-[70vh] min-h-[480px] overflow-hidden flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-gradient-to-b from-rust/30 via-paper to-paper dark:from-rustdark/40 dark:via-paperdark dark:to-paperdark"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div
          className="absolute inset-0 flex items-end justify-center opacity-40 text-[14rem] leading-none select-none"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
          aria-hidden="true"
        >
          📚
        </div>
        <div
          className="absolute inset-0 flex items-start justify-center pt-10 text-6xl select-none opacity-70"
          style={{ transform: `translateY(${scrollY * 0.6}px)` }}
          aria-hidden="true"
        >
          🍂 ☕ 🕯️
        </div>

        <div className="relative z-10 px-6">
          <h1 className="text-5xl font-heading font-bold text-rust dark:text-rust mb-4">
            Dog-Eared
          </h1>
          <p className="max-w-xl mx-auto text-lg text-ink dark:text-inkdark mb-6">
            A cozy corner of the internet for people who photograph their bookshelves,
            swap recommendations, and keep a record of every book that's left a mark.
          </p>
          <button
            className="btn-primary"
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Join the shelf ↓
          </button>
        </div>
      </div>

      <div ref={formRef} className="max-w-md mx-auto px-4 pb-16 pt-4">
        <div className="card">
          <div className="flex mb-4 border-b border-border dark:border-borderdark">
            <button
              className={`flex-1 py-2 font-semibold ${mode === "login" ? "text-rust border-b-2 border-rust" : "text-inksoft dark:text-inksoftdark"}`}
              onClick={() => setMode("login")}
            >
              Log in
            </button>
            <button
              className={`flex-1 py-2 font-semibold ${mode === "signup" ? "text-rust border-b-2 border-rust" : "text-inksoft dark:text-inksoftdark"}`}
              onClick={() => setMode("signup")}
            >
              Register
            </button>
          </div>
          {mode === "login" ? (
            <LoginForm onSubmit={handleLogin} error={error} pending={pending} />
          ) : (
            <SignupForm onSubmit={handleSignup} error={error} pending={pending} />
          )}
        </div>
      </div>
    </div>
  );
}
