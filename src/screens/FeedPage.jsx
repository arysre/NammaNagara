import { useMemo } from 'react'
import { ArrowDownWideNarrow, FilePlus2, SlidersHorizontal } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { filterAndSortPosts } from '../components/PostCard'
import PostCard from '../components/PostCard'

export default function FeedPage({ onOpenPost, onPost, onFilters, trending = false }) {
  const { posts, filters } = useApp()
  const items = useMemo(() => filterAndSortPosts(posts, filters, trending ? 'trending' : 'feed'), [posts, filters, trending])
  return (
    <section className="feed-column">
      <div className="feed-heading">
        <div><span className="eyebrow">Bengaluru · resident reports</span><h1>{trending ? 'Critical / trending' : 'Community feed'}</h1><p>{trending ? 'Reports ranked by demo criticality and resident amplification.' : 'Local issues, updates from residents and the teams responding.'}</p></div>
        <button className="primary-button mobile-post-button" onClick={onPost}><FilePlus2 size={15} />Post</button>
      </div>
      <div className="feed-toolbar"><span>{items.length} {items.length === 1 ? 'report' : 'reports'}{filters.query ? ` matching “${filters.query}”` : ''}</span><button className="quiet-button filter-trigger" onClick={onFilters}><SlidersHorizontal size={15} />Filters and sort</button><span className="feed-sort-indicator"><ArrowDownWideNarrow size={14} />{trending ? 'Critical first' : filters.sort}</span></div>
      {items.length ? <div className="post-list">{items.map((post) => <PostCard key={post.id} post={post} onOpen={onOpenPost} />)}</div> : <div className="empty-state"><div className="empty-icon"><SlidersHorizontal size={20} /></div><h2>No reports match these filters</h2><p>Try another ward, status, or search term.</p></div>}
    </section>
  )
}
