import { Check, Clock3, Users } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { departments } from '../data/wards'
import { formatRelative } from '../components/PostCard'

const nextStatuses = ['Acknowledged', 'In progress', 'Completed']
const govInEmail = /^[^\s@]+@(?:[a-z0-9-]+\.)*gov\.in$/i

export default function GovDeskPage({ employeeEmail, onSignIn, onSignOut }) {
  const { posts, suggestions, updateStatus } = useApp()
  const [department, setDepartment] = useState('Roads')
  const [notice, setNotice] = useState('')
  const [email, setEmail] = useState('')
  const [accessError, setAccessError] = useState('')
  const list = posts.filter((post) => department === 'All departments' || post.department === department).sort((a, b) => new Date(b.time) - new Date(a.time))
  const submitAccess = (event) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!govInEmail.test(normalizedEmail)) {
      setAccessError('Use a government email address ending in .gov.in.')
      return
    }
    setAccessError('')
    onSignIn(normalizedEmail)
  }
  const update = (post, status) => {
    updateStatus(post.id, status)
    setNotice(`${post.title} marked ${status.toLowerCase()}.`)
    window.setTimeout(() => setNotice(''), 2400)
  }
  if (!employeeEmail) {
    return (
      <section className="screen-column">
        <div className="page-heading"><span className="eyebrow">Separate employee view</span><h1>Government employee access</h1><p>Enter a .gov.in address to preview the employee desk in this demo.</p></div>
        <form className="gov-access-card" onSubmit={submitAccess}>
          <label className="form-field"><span>Government email</span><input type="email" required autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setAccessError('') }} placeholder="name@department.gov.in" /></label>
          {accessError && <div className="form-error" role="alert">{accessError}</div>}
          <button className="primary-button" type="submit">Preview employee desk</button>
          <p className="gov-demo-warning">Demo access only: this static website checks the address format, but does not verify the account or protect access. Do not use this as real authentication.</p>
        </form>
      </section>
    )
  }
  return (
    <section className="screen-column">
      <div className="page-heading"><span className="eyebrow">Prototype · officials' view · {employeeEmail}</span><h1>Gov desk</h1><p>Review reports and simulate status updates. Changes appear in the community feed.</p></div>
      <p className="gov-demo-warning">Demo employee view only. Email identity is not verified; all reports and updates are sample data stored in this browser session.</p>
      <div className="gov-toolbar"><label className="filter-field"><span>Department view</span><select value={department} onChange={(event) => setDepartment(event.target.value)}>{departments.map((name) => <option key={name}>{name}</option>)}</select></label><span className="gov-count">{list.length} reports</span></div>
      {notice && <div className="success-note" role="status"><Check size={15} />{notice}</div>}
      <section className="suggestions-section">
        <div className="suggestions-heading"><div><span className="eyebrow">Resident feedback</span><h2>Feature suggestions</h2></div><span className="gov-count">{suggestions.length} {suggestions.length === 1 ? 'request' : 'requests'}</span></div>
        {suggestions.length
          ? <div className="suggestions-list">{suggestions.map((suggestion) => <article className="suggestion-card" key={suggestion.id}><p>{suggestion.text}</p><span>{new Date(suggestion.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span></article>)}</div>
          : <div className="empty-state compact-empty"><h2>No suggestions yet</h2><p>Feature ideas submitted by residents will appear here during this demo session.</p></div>}
      </section>
      <div className="gov-list">{list.map((post) => {
        const next = nextStatuses[nextStatuses.indexOf(post.status) + 1]
        return <article className="gov-card" key={post.id}><div className="gov-card-top"><div><span className="eyebrow">{post.wardNumber} · {post.area}</span><h2>{post.title}</h2></div><span className={`status-chip status-${post.status.toLowerCase().replaceAll(' ', '-')}`}>{post.status}</span></div><p>{post.body}</p><div className="gov-card-footer"><span><Clock3 size={14} />{formatRelative(post.time)}</span><span><Users size={14} />{post.affected} affected</span><span className="department-chip">{post.department}</span><div className="gov-actions">{next && <button className="primary-button" onClick={() => update(post, next)}>Mark {next}</button>}</div></div></article>
      })}</div>
    </section>
  )
}
