import { Search, MapPin, Phone, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { wards } from '../data/wards'
import { useApp } from '../context/AppContext'

export default function Topbar({ onHelpline, onMenu }) {
  const { filters, setFilters } = useApp()
  const navigate = useNavigate()
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={onMenu}><Menu size={19} /></button>
      <label className="search-field">
        <Search size={16} />
        <input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="Search post / grievance / area" aria-label="Search posts, grievances, or areas" />
        {filters.query && <button className="clear-search" onClick={() => setFilters({ ...filters, query: '' })} aria-label="Clear search">×</button>}
      </label>
      <label className="location-select"><MapPin size={15} /><select aria-label="Select Bengaluru ward" value={filters.ward} onChange={(event) => setFilters({ ...filters, ward: event.target.value })}>{wards.map((ward) => <option key={ward.id} value={ward.id}>{ward.label}</option>)}</select></label>
      <button className="quiet-button helpline-button" onClick={onHelpline}><Phone size={15} />Helpline</button>
      <button className="profile-shortcut" onClick={() => navigate('/profile')} aria-label="Open profile"><span>AK</span></button>
    </header>
  )
}
