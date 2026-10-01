import { Link, useNavigate } from "react-router-dom";
import { clearCurrentUser } from "../api";

function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    clearCurrentUser();
    navigate("/");
  }

  return (
    <nav>
      <Link to="/home">Dog-Eared</Link>
      <Link to="/home">Home</Link>
      <Link to="/profile/me">Profile</Link>
      <button onClick={handleLogout}>Log out</button>
    </nav>
  );
}

export default Header;
