import { createContext, useContext, useMemo, useReducer, useState } from 'react'
import { initialPosts } from '../data/posts'

const AppContext = createContext(null)
const statusLabels = ['Posted', 'Acknowledged', 'In progress', 'Completed']

function appReducer(state, action) {
  if (action.type === 'toggle-amplify' || action.type === 'toggle-affected') {
    const key = action.type === 'toggle-amplify' ? 'amplified' : 'affected'
    const countKey = action.type === 'toggle-amplify' ? 'amplifies' : 'affected'
    const active = state[key].includes(action.id)
    return {
      ...state,
      [key]: active ? state[key].filter((id) => id !== action.id) : [...state[key], action.id],
      posts: state.posts.map((post) => post.id === action.id
        ? { ...post, [countKey]: post[countKey] + (active ? -1 : 1) }
        : post),
    }
  }
  if (action.type === 'update-status') {
    const target = statusLabels.indexOf(action.status)
    return {
      ...state,
      posts: state.posts.map((post) => {
        if (post.id !== action.id) return post
        const timeline = post.timeline.filter((item) => statusLabels.indexOf(item.label) < target)
        return { ...post, status: action.status, timeline: [...timeline, { label: action.status, date: action.date }] }
      }),
    }
  }
  if (action.type === 'add-post') return { ...state, posts: [action.post, ...state.posts] }
  if (action.type === 'add-comment') {
    return {
      ...state,
      posts: state.posts.map((post) => post.id === action.id ? { ...post, comments: post.comments + 1 } : post),
    }
  }
  return state
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, { posts: initialPosts, amplified: [], affected: [] })
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
  const toggleAmplify = (id) => dispatch({ type: 'toggle-amplify', id })
  const toggleAffected = (id) => dispatch({ type: 'toggle-affected', id })
  const updateStatus = (id, status) => dispatch({ type: 'update-status', id, status, date: new Date().toISOString() })
  const addPost = (post) => dispatch({ type: 'add-post', post })
  const addComment = (id, text) => {
    setCommentsByPost((current) => ({
      ...current,
      [id]: [...(current[id] || []), { name: 'You', text, time: 'just now' }],
    }))
    dispatch({ type: 'add-comment', id })
  }
  const value = useMemo(() => ({
    posts: state.posts, commentsByPost, filters, setFilters, amplified: state.amplified, affected: state.affected, toggleAmplify, toggleAffected,
    updateStatus, addPost, addComment,
  }), [state, commentsByPost, filters])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
