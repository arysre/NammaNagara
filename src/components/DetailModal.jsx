import { Check, Clock3, MessageCircle, Send, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatRelative } from './PostCard'

const timelineOrder = ['Posted', 'Acknowledged', 'In progress', 'Completed']
const displayDate = (date) => new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

export default function DetailModal({ post, onClose }) {
  const { addComment, commentsByPost } = useApp()
  const comments = commentsByPost[post?.id] || []
  const [draft, setDraft] = useState('')
  if (!post) return null
  const currentIndex = timelineOrder.indexOf(post.status)
  const sendComment = (event) => {
    event.preventDefault()
    if (!draft.trim()) return
    addComment(post.id, draft.trim())
    setDraft('')
  }
  return (
    <div className="modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="detail-modal modal-surface" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="modal-topline"><span className="eyebrow">Grievance detail · {post.wardNumber} / {post.area}</span><button className="icon-button" onClick={onClose} aria-label="Close detail"><X size={18} /></button></div>
        <h2 id="detail-title">{post.title}</h2>
        <div className="detail-subline"><span className={`status-chip status-${post.status.toLowerCase().replaceAll(' ', '-')}`}>{post.status}</span><span>{post.department}</span><span className="mono-meta">Posted {formatRelative(post.time)}</span></div>
        <p className="detail-body">{post.body}</p>
        <section className="timeline-section"><h3><Clock3 size={15} />Status timeline</h3>
          <div className="timeline">{timelineOrder.map((label, index) => {
            const entry = post.timeline.find((item) => item.label === label)
            return <div className={`timeline-item ${index <= currentIndex ? 'timeline-done' : ''}`} key={label}><span className="timeline-dot">{index < currentIndex ? <Check size={11} /> : null}</span><div><strong>{label}</strong><span>{entry ? displayDate(entry.date) : 'Awaiting update'}</span></div></div>
          })}</div>
        </section>
        <section className="comments-section"><h3><MessageCircle size={15} />Resident updates <span>{comments.length} shown · {post.comments} total</span></h3>
          <div className="comment-list">{comments.map((comment, index) => <div className="comment" key={`${comment.name}-${index}`}><span className="comment-avatar">{comment.name.slice(0, 1)}</span><div><div className="comment-heading"><strong>{comment.name}</strong><span>{comment.time}</span></div><p>{comment.text}</p></div></div>)}</div>
          <form className="comment-form" onSubmit={sendComment}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a useful update" aria-label="Write a comment" /><button className="primary-button" aria-label="Send comment" type="submit"><Send size={15} />Send</button></form>
        </section>
      </section>
    </div>
  )
}
