import { createContext, useContext, useMemo, useState } from 'react'
import { initialPosts } from '../data/posts'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts)
  const [commentsByPost, setCommentsByPost] = useState(() => Object.fromEntries(initialPosts.map((post) => [post.id, [
    { name: 'A resident nearby', text: 'I have reported this too. The issue is still there this morning.', time: '2h ago' },
    { name: 'Ward volunteer', text: 'Thanks for documenting the location. I have shared it with the local team.', time: '1h ago' },
  ]])))
  const [filters, setFilters] = useState({
    ward: 'all',
    status: 'All conditions',
    sort: 'Recent',
    department: 'All departments',
    query: '',
  })
  const [amplified, setAmplified] = useState([])
  const [affected, setAffected] = useState([])

  const toggleId = (setter, current, id) => setter(current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const toggleAmplify = (id) => {
    const active = amplified.includes(id)
    toggleId(setAmplified, amplified, id)
    setPosts((current) => current.map((post) => post.id === id ? { ...post, amplifies: post.amplifies + (active ? -1 : 1) } : post))
  }
  const toggleAffected = (id) => {
    const active = affected.includes(id)
    toggleId(setAffected, affected, id)
    setPosts((current) => current.map((post) => post.id === id ? { ...post, affected: post.affected + (active ? -1 : 1) } : post))
  }
  const updateStatus = (id, status) => {
    setPosts((current) => current.map((post) => {
      if (post.id !== id) return post
      const labels = ['Posted', 'Acknowledged', 'In progress', 'Completed']
      const target = labels.indexOf(status)
      const timeline = post.timeline.filter((item) => labels.indexOf(item.label) < target)
      return { ...post, status, timeline: [...timeline, { label: status, date: new Date().toISOString() }] }
    }))
  }
  const addPost = (post) => setPosts((current) => [post, ...current])
  const addComment = (id, text) => {
    setCommentsByPost((current) => ({
      ...current,
      [id]: [...(current[id] || []), { name: 'You', text, time: 'just now' }],
    }))
    setPosts((current) => current.map((post) => post.id === id ? { ...post, comments: post.comments + 1 } : post))
  }
  const value = useMemo(() => ({
    posts, setPosts, commentsByPost, filters, setFilters, amplified, affected, toggleAmplify, toggleAffected,
    updateStatus, addPost, addComment,
  }), [posts, commentsByPost, filters, amplified, affected])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
