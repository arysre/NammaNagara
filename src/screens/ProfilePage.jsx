import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'

export default function ProfilePage({ onOpenPost }) {
  const { posts, affected } = useApp()
  const myPosts = posts.filter((post) => post.author === 'Aarav K')
  const affectedPosts = posts.filter((post) => affected.includes(post.id))
  return (
    <section className="screen-column">
      <div className="profile-header"><span className="profile-avatar">AK</span><div><span className="eyebrow">Demo resident profile</span><h1>Aarav K</h1><p>Bengaluru · Joined for this prototype</p></div></div>
      <div className="profile-tabs"><span>My reports <b>{myPosts.length}</b></span><span>Affected by <b>{affectedPosts.length}</b></span></div>
      <h2 className="section-title">My reports</h2>
      {myPosts.length ? <div className="post-list">{myPosts.map((post) => <PostCard key={post.id} post={post} onOpen={onOpenPost} />)}</div> : <div className="empty-state compact-empty"><h2>No reports yet</h2><p>Reports you submit will appear here.</p></div>}
      <h2 className="section-title section-title-spaced">Issues I’m affected by</h2>
      {affectedPosts.length ? <div className="post-list">{affectedPosts.map((post) => <PostCard key={post.id} post={post} onOpen={onOpenPost} />)}</div> : <div className="empty-state compact-empty"><h2>Nothing marked yet</h2><p>Use “I’m affected” on a report to keep track of it here.</p></div>}
    </section>
  )
}
