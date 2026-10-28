import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { signOut } from "../api.js";
import SearchBar from "./SearchBar.jsx";
import Avatar from "./Avatar.jsx";

export default function Header() {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut();
    } finally {
      setUser(null);
      navigate("/");
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-cardbg dark:bg-cardbgdark border-b border-border dark:border-borderdark">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
        <Link to="/home" className="font-heading text-xl font-bold text-rust shrink-0">
          📖 Dog-Eared
        </Link>

        {user && <SearchBar />}

        <nav className="flex items-center gap-3 flex-wrap">
          <button
            onClick={toggleTheme}
            className="btn-secondary px-3 py-1 text-sm"
            aria-label="Toggle dark mode"
            title="Toggle light/dark mode"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/admin" className="btn-secondary px-3 py-1 text-sm">
                  Admin
                </Link>
              )}
              <Link to={`/profile/${user._id}`} className="flex items-center gap-2">
                <Avatar user={user} size={8} />
                <span className="hidden sm:inline">{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="btn-secondary px-3 py-1 text-sm">
                Log out
              </button>
            </>
          ) : (
            <Link to="/" className="btn-primary px-3 py-1 text-sm">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
