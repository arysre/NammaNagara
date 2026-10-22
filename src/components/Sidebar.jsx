import { NavLink } from 'react-router-dom'
import { Activity, BarChart3, CircleHelp, FilePlus2, Flame, Map, MessageSquareText, UserRound, Users, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Feed', icon: MessageSquareText, end: true },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/trending', label: 'Critical / trending', icon: Flame },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/gov-desk', label: 'Gov desk', icon: Users },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

export default function Sidebar({ onPost, onSuggest, mobileOpen, closeMobile }) {
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={closeMobile} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">N</div>
          <div><strong>NammaBLR</strong><span>Civic issues, clearly tracked</span></div>
          <button className="icon-button sidebar-close" aria-label="Close menu" onClick={closeMobile}><X size={17} /></button>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
              <Icon size={17} strokeWidth={1.7} /><span>{label}</span>
            </NavLink>
          ))}
          <button className="nav-link" onClick={onSuggest}><CircleHelp size={17} strokeWidth={1.7} /><span>Suggest a feature</span></button>
        </nav>
        <button className="primary-button post-button" onClick={onPost}><FilePlus2 size={16} />Post grievance</button>
        <div className="sidebar-bottom">
          <a href="#about" onClick={(event) => { event.preventDefault(); document.getElementById('about-modal')?.showModal() }}>About project</a>
          <div className="live-count"><span className="live-dot" /> <Activity size={14} /> 128 residents online</div>
          <small>Ward numbers are illustrative mock data.</small>
        </div>
      </aside>
    </>
  )
}
