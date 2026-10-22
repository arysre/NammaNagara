import { Bot, MessageCircle, Send, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Chatbot() {
  const { posts } = useApp()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Describe a civic issue and I’ll look for matching reports in this demo.' }])
  const send = (event) => {
    event.preventDefault()
    const query = input.trim()
    if (!query) return
    const words = query.toLowerCase().split(/\s+/).filter((word) => word.length > 3)
    const matches = posts.filter((post) => words.some((word) => `${post.title} ${post.body} ${post.area}`.toLowerCase().includes(word))).slice(0, 2)
    const reply = matches.length
      ? `I found ${matches.length} possible match${matches.length > 1 ? 'es' : ''}: ${matches.map((post) => `${post.title} (${post.status})`).join('; ')}.`
      : 'I could not find a close match. Try a location or a few words describing the issue.'
    setMessages([...messages, { from: 'you', text: query }, { from: 'bot', text: reply }])
    setInput('')
  }
  return (
    <div className="chatbot">
      {open && <section className="chat-panel" aria-label="Civic issue helper">
        <header><span className="chat-icon"><Bot size={16} /></span><div><strong>Issue helper</strong><span>Mock matching · not official advice</span></div><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close chat"><X size={17} /></button></header>
        <div className="chat-messages">{messages.map((message, index) => <p key={index} className={`chat-message chat-${message.from}`}>{message.text}</p>)}</div>
        <form className="chat-form" onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Describe the problem" aria-label="Describe a problem" /><button className="primary-button" aria-label="Send message"><Send size={15} /></button></form>
      </section>}
      <button className={`chat-toggle ${open ? 'chat-toggle-open' : ''}`} onClick={() => setOpen(!open)} aria-label={open ? 'Close issue helper' : 'Open issue helper'}>{open ? <X size={19} /> : <><MessageCircle size={18} /><span>Ask about an issue</span></>}</button>
    </div>
  )
}
