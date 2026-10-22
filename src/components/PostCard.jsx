import { Check, MessageCircle, Share2, ThumbsUp, Users } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

export function formatRelative(dateString) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(dateString).getTime()) / 60000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function score(criticality) {
  return { Low: 1, Medium: 2, High: 3, Critical: 4 }[criticality] || 1
}

export function filterAndSortPosts(posts, filters, mode = 'feed') {
  const filtered = posts.filter((post) => {
    const search = filters.query.trim().toLowerCase()
    const matchesQuery = !search || `${post.title} ${post.body} ${post.area} ${post.department} ${post.author}`.toLowerCase().includes(search)
    return (filters.ward === 'all' || filters.ward === post.ward)
      && (filters.status === 'All conditions' || filters.status === post.status)
      && (filters.department === 'All departments' || filters.department === post.department)
      && matchesQuery
  })
  const sort = mode === 'trending' ? 'AI critical score' : filters.sort
  return filtered.sort((a, b) => {
    if (sort === 'Most amplified') return b.amplifies - a.amplifies
    if (sort === 'AI critical score') return score(b.criticality) - score(a.criticality) || b.amplifies - a.amplifies
    if (sort === 'Most affected') return b.affected - a.affected
    return new Date(b.time) - new Date(a.time)
  })
}

export default function PostCard({ post, onOpen }) {
  const { amplified, affected, toggleAmplify, toggleAffected } = useApp()
  const [notice, setNotice] = useState('')
  const handleShare = async (event) => {
    event.stopPropagation()
    const url = `${window.location.origin}/?post=${post.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: `NammaNagara report: ${post.title}`, url })
        setNotice('Shared')
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setNotice('Link copied')
      } else {
        throw new Error('Sharing is not available in this browser.')
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setNotice('Could not share')
    }
    window.setTimeout(() => setNotice(''), 2200)
  }
  const stop = (event) => event.stopPropagation()
  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen(post)
    }
  }
  return (
    <article className="post-card" onClick={() => onOpen(post)} tabIndex={0} onKeyDown={handleKeyDown} aria-label={`Open grievance: ${post.title}`}>
      <div className="post-first-row">
        <span className={`avatar avatar-${post.color}`}>{post.initials}</span>
        <div className="author-block"><strong>{post.author}{post.verified && <span className="verified-mark" title="Verified"><Check size={10} /></span>}</strong><span>{post.wardNumber} · {post.area}</span></div>
        <span className={`status-chip status-${post.status.toLowerCase().replaceAll(' ', '-')}`}>{post.status}</span>
      </div>
      <div className="post-meta">
        <span className="mono-meta">{formatRelative(post.time)}</span><span className="meta-divider" />
        <span className="department-chip">{post.department}</span>
        <span className={`critical-chip critical-${post.criticality.toLowerCase()}`}>{post.criticality} priority</span>
      </div>
      <h3>{post.title}</h3>
      <p className="post-body">{post.body}</p>
      {post.image && <div className={`post-image-placeholder image-${post.color} ${post.mediaUrl ? 'uploaded-media' : ''}`} role="img" aria-label={post.mediaUrl ? 'Resident-uploaded media' : 'Illustrative image placeholder'}>{post.mediaUrl ? post.mediaType?.startsWith('video/') ? <video src={post.mediaUrl} controls onClick={(event) => event.stopPropagation()} /> : <img src={post.mediaUrl} alt="Resident-submitted report" /> : <span>Resident photo · illustrative</span>}</div>}
      <div className="post-actions" onClick={stop} aria-live="polite">
        <button className={`action-button ${amplified.includes(post.id) ? 'action-selected' : ''}`} onClick={() => toggleAmplify(post.id)} aria-pressed={amplified.includes(post.id)}><ThumbsUp size={15} />Amplify <span>{post.amplifies}</span></button>
        <button className={`action-button ${affected.includes(post.id) ? 'action-selected' : ''}`} onClick={() => toggleAffected(post.id)} aria-pressed={affected.includes(post.id)}><Users size={15} />I'm affected <span>{post.affected}</span></button>
        <button className="action-button" onClick={() => onOpen(post)}><MessageCircle size={15} />Comment <span>{post.comments}</span></button>
        <button className="action-button action-share" onClick={handleShare}><Share2 size={15} /><span>{notice || 'Share'}</span></button>
      </div>
    </article>
  )
}
