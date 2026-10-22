import { FileImage, LoaderCircle, MapPin, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { departments, wards, wardCoordinates, wardName } from '../data/wards'

const bannedWords = ['spam', 'kill', 'hate speech', 'explicit']
const maxMediaBytes = 5 * 1024 * 1024
const wardNumbers = Object.fromEntries(wards.map((ward) => [ward.id, ward.label.match(/\d+/)?.[0] || '000']))

function findBannedWord(text) {
  return bannedWords.find((word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replaceAll(' ', '\\s+')
    return new RegExp(`(^|\\W)${escaped}($|\\W)`, 'i').test(text)
  })
}

export default function GrievanceModal({ onClose }) {
  const { posts, addPost } = useApp()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Roads')
  const [ward, setWard] = useState('ward-151')
  const [media, setMedia] = useState(null)
  const [preview, setPreview] = useState('')
  const [mediaReading, setMediaReading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const readerRef = useRef(null)
  const clearModerationError = () => setError((current) => (
    current.startsWith('This demo moderation check flagged') ? '' : current
  ))
  const matches = useMemo(() => {
    const words = title.toLowerCase().split(/\s+/).filter((word) => word.length > 3)
    if (!words.length) return []
    return posts.filter((post) => post.ward === ward && words.some((word) => `${post.title} ${post.body}`.toLowerCase().includes(word))).slice(0, 3)
  }, [title, ward, posts])
  useEffect(() => () => readerRef.current?.abort(), [])
  const readMedia = (file) => {
    readerRef.current?.abort()
    readerRef.current = null
    setError('')
    setMedia(file)
    setPreview('')
    setMediaReading(false)
    if (!file) {
      return
    }
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setMedia(null)
      setError('Choose an image or video file.')
      return
    }
    if (file.size > maxMediaBytes) {
      setMedia(null)
      setError('The selected file is over 5 MB. Choose a smaller image or video.')
      return
    }
    const reader = new FileReader()
    readerRef.current = reader
    setMediaReading(true)
    reader.onload = () => {
      if (readerRef.current !== reader) return
      if (typeof reader.result === 'string') setPreview(reader.result)
      else setError('The selected file could not be previewed. Please choose another file.')
      setMediaReading(false)
      readerRef.current = null
    }
    reader.onerror = () => {
      if (readerRef.current !== reader) return
      setError('The selected file could not be previewed. Please choose another file.')
      setMediaReading(false)
      readerRef.current = null
    }
    reader.readAsDataURL(file)
  }
  const submit = (event) => {
    event.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('Add a title and description before submitting.')
      return
    }
    if (mediaReading) return
    setError('')
    setChecking(true)
    window.setTimeout(() => {
      const text = `${title} ${description}`.toLowerCase()
      const blocked = findBannedWord(text)
      setChecking(false)
      if (blocked) {
        setError(`This demo moderation check flagged “${blocked}”. Please edit the title or description and try again.`)
        return
      }
      const now = new Date().toISOString()
      addPost({
        id: `new-${Date.now()}`, author: 'Aarav K', initials: 'AK', verified: false, ward, wardNumber: wardNumbers[ward], area: wardName(ward),
        department: category, status: 'Active', criticality: 'Medium', title: title.trim(), body: description.trim(), time: now,
        amplifies: 0, affected: 0, comments: 0, color: 'sage', coords: wardCoordinates(ward), image: Boolean(preview), mediaUrl: preview, mediaType: media?.type, timeline: [{ label: 'Posted', date: now }],
      })
      onClose()
    }, 900)
  }
  return (
    <div className="modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget && !checking) onClose() }}>
      <section className="form-modal modal-surface" role="dialog" aria-modal="true" aria-labelledby="grievance-title">
        <div className="modal-topline"><div><span className="eyebrow">New report</span><h2 id="grievance-title">Post a grievance</h2></div><button className="icon-button" onClick={onClose} disabled={checking} aria-label="Close form"><X size={18} /></button></div>
        <form onSubmit={submit} className="grievance-form">
          <label className="form-field"><span>Title</span><input required maxLength="100" value={title} onChange={(event) => { setTitle(event.target.value); clearModerationError() }} placeholder="What is the issue?" /><small>Be specific about what happened and where.</small></label>
          {title.trim() && <div className="similar-box"><strong>Similar complaints nearby</strong>{matches.length ? matches.map((post) => <div className="similar-item" key={post.id}><span>{post.title}</span><span className={`status-chip status-${post.status.toLowerCase().replaceAll(' ', '-')}`}>{post.status}</span></div>) : <p>No matching complaints found in this ward yet.</p>}</div>}
          <label className="form-field"><span>Description</span><textarea required rows="4" maxLength="1000" value={description} onChange={(event) => { setDescription(event.target.value); clearModerationError() }} placeholder="Add details that can help the right team respond." /></label>
          <div className="form-row">
            <label className="form-field"><span>Department</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{departments.filter((name) => name !== 'All departments').map((name) => <option key={name}>{name}</option>)}</select></label>
            <label className="form-field"><span>Ward / location</span><select value={ward} onChange={(event) => setWard(event.target.value)}>{wards.filter((item) => item.id !== 'all').map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          </div>
          <label className="upload-control"><FileImage size={17} /><span>{media ? media.name : 'Add an image or video'}</span><input type="file" accept="image/*,video/*" onChange={(event) => readMedia(event.target.files?.[0] || null)} /></label>
          {preview && <div className="upload-preview">{media?.type.startsWith('video/') ? <video src={preview} controls /> : <img src={preview} alt="Upload preview" />}</div>}
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="moderation-note"><MapPin size={14} />Demo only. A mock text check will reject sample words; no real AI or service is connected.</div>
          <div className="modal-actions"><button type="button" className="quiet-button" onClick={onClose} disabled={checking}>Cancel</button><button type="submit" className="primary-button" disabled={checking || mediaReading || Boolean(error) || !title.trim() || !description.trim()}>{checking ? <><LoaderCircle className="spin" size={15} />Checking report…</> : mediaReading ? 'Loading media…' : 'Submit grievance'}</button></div>
        </form>
      </section>
    </div>
  )
}
