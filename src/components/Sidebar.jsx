import { NavLink } from 'react-router-dom'
import { Activity, BarChart3, CircleHelp, FilePlus2, Flame, Map, MessageSquareText, UserRound, Users, X } from 'lucide-react'

const residentLinks = [
  { to: '/', label: 'Feed', icon: MessageSquareText, end: true },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/trending', label: 'Critical / trending', icon: Flame },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

const employeeLink = { to: '/gov-desk', label: 'Gov desk', icon: Users }

export default function Sidebar({ onPost, onSuggest, employeeEmail, onEmployeeSignOut, mobileOpen, closeMobile }) {
  const links = employeeEmail
    ? [...residentLinks.slice(0, 4), employeeLink, residentLinks[4]]
    : residentLinks
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={closeMobile} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">N</div>
          <div><strong>NammaNagara</strong><span>Civic issues, clearly tracked</span></div>
          <button className="icon-button sidebar-close" aria-label="Close menu" onClick={closeMobile}><X size={17} /></button>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
              <Icon size={17} strokeWidth={1.7} /><span>{label}</span>
            </NavLink>
          ))}
          {!employeeEmail && <button className="nav-link" onClick={onSuggest}><CircleHelp size={17} strokeWidth={1.7} /><span>Suggest a feature</span></button>}
        </nav>
        {!employeeEmail && <button className="primary-button post-button" onClick={onPost}><FilePlus2 size={16} />Post grievance</button>}
        <div className="sidebar-bottom">
          <a href="#about" onClick={(event) => { event.preventDefault(); document.getElementById('about-modal')?.showModal() }}>About project</a>
          {employeeEmail
            ? <button className="employee-session-button" onClick={onEmployeeSignOut}>Sign out employee view</button>
            : <NavLink to="/employee-access" onClick={closeMobile}>Employee sign in</NavLink>}
          <div className="live-count"><span className="live-dot" /> <Activity size={14} /> 128 residents online</div>
          <small>Ward numbers are illustrative mock data.</small>
        </div>
      </aside>
    </>
  )
}
