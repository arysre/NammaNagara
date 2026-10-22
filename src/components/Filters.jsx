import { Filter, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { departments, wards } from '../data/wards'

function SelectFilter({ label, value, onChange, options }) {
  return <label className="filter-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

export function FilterFields() {
  const { filters, setFilters } = useApp()
  const update = (key, value) => setFilters({ ...filters, [key]: value })
  return (
    <>
      <SelectFilter label="Area" value={filters.ward} onChange={(value) => update('ward', value)} options={wards.map(({ id, label }) => ({ value: id, label }))} />
      <SelectFilter label="Condition" value={filters.status} onChange={(value) => update('status', value)} options={['All conditions', 'Acknowledged', 'Active', 'In progress', 'Completed'].map((label) => ({ value: label, label }))} />
      <SelectFilter label="Sort by" value={filters.sort} onChange={(value) => update('sort', value)} options={['Recent', 'Most amplified', 'AI critical score', 'Most affected'].map((label) => ({ value: label, label }))} />
      <SelectFilter label="Department" value={filters.department} onChange={(value) => update('department', value)} options={departments.map((label) => ({ value: label, label }))} />
      <button className="text-button clear-filters" onClick={() => setFilters({ ward: 'all', status: 'All conditions', sort: 'Recent', department: 'All departments', query: filters.query })}>Reset filters</button>
    </>
  )
}

export default function Filters({ drawerOpen, onClose }) {
  return (
    <>
      {drawerOpen && <button className="drawer-scrim" onClick={onClose} aria-label="Close filters" />}
      <aside className={`filters-panel ${drawerOpen ? 'filters-drawer-open' : ''}`}>
        <div className="filters-heading"><h2><Filter size={16} />Filters and sort</h2><button className="icon-button drawer-close" onClick={onClose} aria-label="Close filters"><X size={17} /></button></div>
        <FilterFields />
        <p className="filter-note">Filters apply to the current feed. Mock ward names and numbers are for demo use.</p>
      </aside>
    </>
  )
}
