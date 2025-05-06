import { Link } from "react-router-dom";
import "../css/navbar.css";

export default function NavBar() {
  return (
    <nav>
      <ul>
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/instructors">Instructors</Link>
        <Link to="/about">About Us</Link>
      </ul>
    </nav>
  );
}
