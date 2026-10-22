import { divIcon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import PostCard, { filterAndSortPosts } from '../components/PostCard'
import 'leaflet/dist/leaflet.css'

const statusColors = { Active: '#b16b53', Acknowledged: '#778e78', 'In progress': '#ad8c55', Completed: '#8495a0' }
const statusIcons = Object.fromEntries(Object.entries(statusColors).map(([status, color]) => [
  status,
  divIcon({
    className: 'issue-marker-wrap',
    html: `<span class="issue-marker" style="--marker-color:${color}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  }),
]))

function ResizeMap() {
  const map = useMap()
  useEffect(() => { const timer = window.setTimeout(() => map.invalidateSize(), 120); return () => window.clearTimeout(timer) }, [map])
  return null
}

export default function MapPage({ onOpenPost }) {
  const { posts, filters } = useApp()
  const items = useMemo(() => filterAndSortPosts(posts, filters), [posts, filters])
  const [selectedId, setSelectedId] = useState(null)
  const selected = items.find((post) => post.id === selectedId)
  return (
    <section className="screen-column map-screen">
      <div className="page-heading"><span className="eyebrow">Bengaluru · OpenStreetMap</span><h1>Issue map</h1><p>Approximate report locations for this prototype. Marker colour reflects the current status.</p></div>
      <div className="map-legend">{[['status-active', 'Active'], ['status-acknowledged', 'Acknowledged'], ['status-in-progress', 'In progress'], ['status-completed', 'Completed']].map(([className, name]) => <span key={name}><i className={className} />{name}</span>)}</div>
      <div className="map-wrapper"><MapContainer center={[12.9716, 77.5946]} zoom={11} scrollWheelZoom className="leaflet-map">
        <ResizeMap /><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {items.map((post) => {
          return <Marker key={post.id} position={post.coords} icon={statusIcons[post.status]} eventHandlers={{ click: () => setSelectedId(post.id) }}><Popup><strong>{post.title}</strong><br />{post.area} · {post.status}<br /><button className="map-popup-button" onClick={() => onOpenPost(post)}>Open report</button></Popup></Marker>
        })}
      </MapContainer></div>
      {selected && <div className="map-selected"><button className="text-button map-selected-close" onClick={() => setSelectedId(null)}>Close</button><PostCard post={selected} onOpen={onOpenPost} /></div>}
      {!items.length && <div className="map-empty"><MapPin size={16} />No reports match the selected filters.</div>}
    </section>
  )
}
