import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BarChart3, FilePlus2, Flame, Map, MessageSquareText, UserRound, Users } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Filters from './components/Filters'
import { AboutDialog, HelplineModal, SuggestModal } from './components/UtilityModal'
import GrievanceModal from './components/GrievanceModal'
import DetailModal from './components/DetailModal'
import Chatbot from './components/Chatbot'
import { useApp } from './context/AppContext'

const FeedPage = lazy(() => import('./screens/FeedPage'))
const MapPage = lazy(() => import('./screens/MapPage'))
const AnalyticsPage = lazy(() => import('./screens/AnalyticsPage'))
const GovDeskPage = lazy(() => import('./screens/GovDeskPage'))
const ProfilePage = lazy(() => import('./screens/ProfilePage'))

const residentMobileLinks = [
  { to: '/', label: 'Feed', icon: MessageSquareText, end: true },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/trending', label: 'Critical', icon: Flame },
  { to: '/analytics', label: 'Stats', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: UserRound },
]
const employeeMobileLinks = [
  { to: '/', label: 'Feed', icon: MessageSquareText, end: true },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/gov-desk', label: 'Gov desk', icon: Users },
  { to: '/analytics', label: 'Stats', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { posts } = useApp()
  const [showGrievance, setShowGrievance] = useState(false)
  const [showHelpline, setShowHelpline] = useState(false)
  const [showSuggest, setShowSuggest] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activePostId, setActivePostId] = useState(null)
  const [govEmployeeEmail, setGovEmployeeEmail] = useState('')
  const activePost = useMemo(() => posts.find((post) => post.id === activePostId), [posts, activePostId])
  const mobileLinks = govEmployeeEmail ? employeeMobileLinks : residentMobileLinks
  const usesFilters = ['/', '/trending', '/map'].includes(location.pathname)
  useEffect(() => {
    const postId = searchParams.get('post')
    setActivePostId(postId && posts.some((post) => post.id === postId) ? postId : null)
  }, [searchParams, posts])
  const openPost = (post) => setSearchParams({ post: post.id })
  const closePost = () => {
    setActivePostId(null)
    if (searchParams.has('post')) setSearchParams({}, { replace: true })
  }
  return (
    <div className="app-shell">
      <Sidebar
        onPost={() => setShowGrievance(true)}
        onSuggest={() => setShowSuggest(true)}
        employeeEmail={govEmployeeEmail}
        onEmployeeSignOut={() => { setGovEmployeeEmail(''); navigate('/') }}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />
      <div className="main-column">
        <Topbar onHelpline={() => setShowHelpline(true)} onMenu={() => setMobileOpen(true)} />
        <div className={`content-layout ${usesFilters ? '' : 'content-no-filters'}`}>
          <main className="main-content">
            <Suspense fallback={<div className="screen-loading" role="status">Loading this screen…</div>}>
              <Routes>
                <Route path="/" element={<FeedPage onOpenPost={openPost} onPost={() => setShowGrievance(true)} onFilters={() => setShowFilters(true)} canPost={!govEmployeeEmail} />} />
                <Route path="/map" element={<MapPage onOpenPost={openPost} />} />
                <Route path="/trending" element={<FeedPage trending onOpenPost={openPost} onPost={() => setShowGrievance(true)} onFilters={() => setShowFilters(true)} canPost={!govEmployeeEmail} />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route
                  path="/employee-access"
                  element={govEmployeeEmail
                    ? <Navigate to="/gov-desk" replace />
                    : <GovDeskPage onSignIn={(email) => { setGovEmployeeEmail(email); navigate('/gov-desk') }} />}
                />
                <Route path="/gov-desk" element={govEmployeeEmail
                  ? <GovDeskPage employeeEmail={govEmployeeEmail} onSignOut={() => { setGovEmployeeEmail(''); navigate('/') }} />
                  : <Navigate to="/employee-access" replace />}
                />
                <Route path="/profile" element={<ProfilePage onOpenPost={openPost} />} />
                <Route path="*" element={<FeedPage onOpenPost={openPost} onPost={() => setShowGrievance(true)} onFilters={() => setShowFilters(true)} canPost={!govEmployeeEmail} />} />
              </Routes>
            </Suspense>
          </main>
          {usesFilters && <Filters drawerOpen={showFilters} onClose={() => setShowFilters(false)} />}
          {!usesFilters && <aside className="context-panel"><span className="eyebrow">NammaNagara prototype</span><h2>What’s in this demo</h2><p>Twenty realistic sample reports across Bengaluru areas. All responses and status changes are local to this session.</p><div className="context-stat"><strong>{posts.length}</strong><span>mock reports</span></div><button className="quiet-button" onClick={() => navigate('/')}><MessageSquareText size={15} />Back to feed</button><p className="context-disclaimer">Not connected to BBMP, BWSSB, BESCOM or any official service.</p></aside>}
        </div>
      </div>
      <nav className="mobile-tabbar" aria-label="Mobile navigation">
        {mobileLinks.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `mobile-tab ${isActive ? 'mobile-tab-active' : ''}`}><Icon size={18} /><span>{label}</span></NavLink>)}
        {!govEmployeeEmail && <button className="mobile-tab mobile-create" onClick={() => setShowGrievance(true)}><FilePlus2 size={18} /><span>Post</span></button>}
      </nav>
      <Chatbot />
      <AboutDialog />
      {showGrievance && !govEmployeeEmail && <GrievanceModal onClose={() => setShowGrievance(false)} />}
      {activePost && <DetailModal post={activePost} onClose={closePost} />}
      {showHelpline && <HelplineModal onClose={() => setShowHelpline(false)} />}
      {showSuggest && !govEmployeeEmail && <SuggestModal onClose={() => setShowSuggest(false)} />}
    </div>
  )
}
