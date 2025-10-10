import { NavLink } from "react-router-dom";
import avatar from "../assets/avatar.svg";

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Learner profile">
      <header className="sidebar__brand">
        <div className="sidebar__profile">
          <img src={avatar} alt="Jacob Sutanto avatar" className="avatar" />
          <div>
            <p className="brand">Quest Comprehend</p>
            <h1 className="learner-name">Jacob Sutanto</h1>
          </div>
        </div>
      </header>
      <nav className="sidebar__nav" aria-label="Primary">
        <h2 className="section-title">Navigation</h2>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                ["nav-link", isActive ? "nav-link--active" : ""].filter(Boolean).join(" ")
              }
            >
              Choose Adventure
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/journal"
              className={({ isActive }) =>
                ["nav-link", isActive ? "nav-link--active" : ""].filter(Boolean).join(" ")
              }
            >
              Journal
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
