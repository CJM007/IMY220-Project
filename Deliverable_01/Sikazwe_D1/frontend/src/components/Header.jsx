import { Link } from "react-router-dom";

function Header() {
  return (
    <nav>
      <Link to="/home">Dog-Eared</Link>
      <Link to="/home">Home</Link>
      <Link to="/profile/1">Profile</Link>
      <Link to="/post/1">Sample Post</Link>
      <button>Log out</button>
    </nav>
  );
}

export default Header;
