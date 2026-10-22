import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

const chartColors = ['#788e79', '#b16b53', '#8b9ca2', '#b49763', '#9c8877', '#70807c']
export default function AnalyticsPage() {
  const { posts } = useApp()
  const { departments, wards, statuses, openCount, completedCount, avgDays } = useMemo(() => {
    const departmentCounts = new Map()
    const wardCounts = new Map()
    const statusCounts = new Map([['Active', 0], ['Acknowledged', 0], ['In progress', 0], ['Completed', 0]])
    let openCount = 0
    let completedCount = 0
    let completedDays = 0

    for (const post of posts) {
      departmentCounts.set(post.department, (departmentCounts.get(post.department) || 0) + 1)
      const area = post.area.split(' ')[0] === 'Koramangala' ? 'Koramangala' : post.area.split(' ')[0]
      wardCounts.set(area, (wardCounts.get(area) || 0) + 1)
      statusCounts.set(post.status, (statusCounts.get(post.status) || 0) + 1)
      if (post.status === 'Completed') {
        completedCount += 1
        const posted = new Date(post.time)
        const done = new Date(post.timeline.find((item) => item.label === 'Completed')?.date || post.time)
        completedDays += Math.max(0, (done - posted) / 86400000)
      } else {
        openCount += 1
      }
    }

    return {
      departments: [...departmentCounts].map(([name, count]) => ({ name, count })),
      wards: [...wardCounts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 7),
      statuses: [...statusCounts].map(([name, count]) => ({ name, count })),
      openCount,
      completedCount,
      avgDays: completedCount ? (completedDays / completedCount).toFixed(1) : '—',
    }
  }, [posts])
  return (
    <section className="screen-column">
      <div className="page-heading"><span className="eyebrow">Demo data · all wards</span><h1>Analytics</h1><p>Counts describe the mock reports currently shown in this prototype.</p></div>
      <div className="metric-row"><div className="metric-card"><span>Total reports</span><strong>{posts.length}</strong></div><div className="metric-card"><span>Open reports</span><strong>{openCount}</strong></div><div className="metric-card"><span>Completed</span><strong>{completedCount}</strong></div><div className="metric-card"><span>Mean days to resolve</span><strong>{avgDays}<small> days</small></strong></div></div>
      <div className="analytics-grid">
        <section className="chart-card"><h2>Reports by department</h2><p>Current mock feed counts</p><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={departments} margin={{ top: 5, right: 12, left: -22, bottom: 20 }}><CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#dedbd3" /><XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: '#74746f' }} /><YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#74746f' }} /><Tooltip /><Bar dataKey="count" fill="#788e79" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></div></section>
        <section className="chart-card"><h2>Reports by status</h2><p>Status from the current mock feed</p><div className="chart-area chart-pie"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statuses} dataKey="count" nameKey="name" innerRadius={55} outerRadius={86} paddingAngle={2}>{statuses.map((entry, index) => <Cell key={entry.name} fill={chartColors[index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="chart-legend">{statuses.map((entry, index) => <span key={entry.name}><i style={{ background: chartColors[index] }} />{entry.name} <b>{entry.count}</b></span>)}</div></section>
        <section className="chart-card chart-wide"><h2>Reports by area</h2><p>Top seven locations in this mock dataset</p><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={wards} layout="vertical" margin={{ top: 5, right: 18, left: 14, bottom: 0 }}><CartesianGrid strokeDasharray="2 4" horizontal={false} stroke="#dedbd3" /><XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#74746f' }} /><YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: '#74746f' }} /><Tooltip /><Bar dataKey="count" fill="#9d806a" radius={[0, 2, 2, 0]} /></BarChart></ResponsiveContainer></div></section>
      </div>
      <p className="data-disclaimer">No live city services, official ward boundaries or departmental systems are connected.</p>
    </section>
  )
}
