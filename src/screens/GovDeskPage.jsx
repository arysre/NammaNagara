import { Check, Clock3, Users } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { departments } from '../data/wards'
import { formatRelative } from '../components/PostCard'

const nextStatuses = ['Acknowledged', 'In progress', 'Completed']
export default function GovDeskPage() {
  const { posts, updateStatus } = useApp()
  const [department, setDepartment] = useState('Roads')
  const [notice, setNotice] = useState('')
  const list = posts.filter((post) => department === 'All departments' || post.department === department).sort((a, b) => new Date(b.time) - new Date(a.time))
  const update = (post, status) => {
    updateStatus(post.id, status)
    setNotice(`${post.title} marked ${status.toLowerCase()}.`)
    window.setTimeout(() => setNotice(''), 2400)
  }
  return (
    <section className="screen-column">
      <div className="page-heading"><span className="eyebrow">Prototype · officials' view</span><h1>Gov desk</h1><p>Review reports and simulate status updates. Changes appear in the community feed.</p></div>
      <div className="gov-toolbar"><label className="filter-field"><span>Department view</span><select value={department} onChange={(event) => setDepartment(event.target.value)}>{departments.map((name) => <option key={name}>{name}</option>)}</select></label><span className="gov-count">{list.length} reports</span></div>
      {notice && <div className="success-note" role="status"><Check size={15} />{notice}</div>}
      <div className="gov-list">{list.map((post) => {
        const next = nextStatuses[nextStatuses.indexOf(post.status) + 1]
        return <article className="gov-card" key={post.id}><div className="gov-card-top"><div><span className="eyebrow">{post.wardNumber} · {post.area}</span><h2>{post.title}</h2></div><span className={`status-chip status-${post.status.toLowerCase().replaceAll(' ', '-')}`}>{post.status}</span></div><p>{post.body}</p><div className="gov-card-footer"><span><Clock3 size={14} />{formatRelative(post.time)}</span><span><Users size={14} />{post.affected} affected</span><span className="department-chip">{post.department}</span><div className="gov-actions">{next && <button className="primary-button" onClick={() => update(post, next)}>Mark {next}</button>}</div></div></article>
      })}</div>
    </section>
  )
}
