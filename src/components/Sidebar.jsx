import { NavLink } from "react-router-dom";
import avatar from "../assets/avatar.svg";

const navLinks = [
  { to: "/", label: "Choose Adventure" },
  { to: "/#badges", label: "Badges" },
  { to: "/#journal", label: "Journal" }
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Learner profile">
      <header className="sidebar__brand">
        <div className="sidebar__profile">
          <img src={avatar} alt="Jacob Sutanto avatar" className="avatar" />
          <div>
            <p className="brand">Quest Comprehend</p>
            <h1 className="learner-name">Explorer</h1>
          </div>
        </div>
      </header>
      <section className="sidebar__stats" aria-labelledby="badgeHeading">
        <h2 className="section-title" id="badgeHeading">Badges</h2>
        <ul className="badge-list" id="badgeList">
          <li className="badge"><span className="badge__icon">⭐</span>Curious Reader</li>
          <li className="badge"><span className="badge__icon">🧠</span>Word Wizard</li>
          <li className="badge"><span className="badge__icon">🗺️</span>Adventure Mapper</li>
        </ul>
        <div className="progress">1280 Quest Points</div>
      </section>
      <nav className="sidebar__nav" aria-label="Primary">
        <h2 className="section-title">Navigation</h2>
        <ul>
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink to={link.to}>{link.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
