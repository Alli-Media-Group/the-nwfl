import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from 'recharts'
import { fetchAnalyticsSeason, fetchStandings } from '../../lib/api'
import './Analytics.scss'

const GROUP_COLORS = { A: '#8A3DFF', B: '#6A2BD9' }

// ── Custom tooltip shared across charts ──────────────────────────────────────
function ChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="analytics__tooltip">
      <p className="analytics__tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>
          {p.name}: <strong>{p.value}{unit}</strong>
        </p>
      ))}
    </div>
  )
}

// ── Custom bar shape — draws a dash for zero, bar otherwise ──────────────────
function GDBar(props) {
  const { x, y, width, height, value, fill } = props
  if (value === 0) {
    const dashW = 16
    const dashH = 3
    return (
      <rect
        x={x}
        y={y + height / 2 - dashH / 2}
        width={dashW}
        height={dashH}
        fill="rgba(167,143,191,0.4)"
        rx={2}
      />
    )
  }
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />
}

// ── Goal Difference chart (from standings) ───────────────────────────────────
function GoalDifferenceChart({ data }) {
  const sorted = [...data].sort((a, b) => b.gd - a.gd)
  return (
    <div className="analytics__chart-wrap">
      <h3 className="analytics__chart-title">Goal Difference</h3>
      <ResponsiveContainer width="100%" height={sorted.length * 36 + 60}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 8, right: 40, left: 140, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(138,61,255,0.12)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#a78fbf', fontSize: 12, fontFamily: 'Poppins' }}
            axisLine={{ stroke: 'rgba(138,61,255,0.2)' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={135}
            tick={{ fill: '#f0e6ff', fontSize: 12, fontFamily: 'Poppins' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip unit="" />} cursor={{ fill: 'rgba(138,61,255,0.08)' }} />
          <Bar
            dataKey="gd"
            name="Goal Diff"
            shape={(props) => (
              <GDBar {...props} fill={props.value >= 0 ? '#8A3DFF' : '#ef4444'} />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Clean Sheets chart (from season stats) ───────────────────────────────────
function CleanSheetsChart({ data }) {
  const sorted = [...data].sort((a, b) => b.clean_sheets - a.clean_sheets)
  return (
    <div className="analytics__chart-wrap">
      <h3 className="analytics__chart-title">Clean Sheets</h3>
      <ResponsiveContainer width="100%" height={sorted.length * 36 + 60}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 8, right: 40, left: 140, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(138,61,255,0.12)" horizontal={false} />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: '#a78fbf', fontSize: 12, fontFamily: 'Poppins' }}
            axisLine={{ stroke: 'rgba(138,61,255,0.2)' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="team_name"
            width={135}
            tick={{ fill: '#f0e6ff', fontSize: 12, fontFamily: 'Poppins' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(138,61,255,0.08)' }} />
          <Bar dataKey="clean_sheets" name="Clean Sheets" radius={[0, 4, 4, 0]}>
            {sorted.map((entry, i) => (
              <Cell key={i} fill={GROUP_COLORS[entry.group] ?? '#8A3DFF'} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Avg Goals Scored vs Conceded (grouped bar) ───────────────────────────────
function GoalAveragesChart({ data }) {
  const sorted = [...data].sort(
    (a, b) => b.avg_goals_scored - a.avg_goals_scored
  )
  return (
    <div className="analytics__chart-wrap">
      <h3 className="analytics__chart-title">Avg Goals — Scored vs Conceded</h3>
      <ResponsiveContainer width="100%" height={sorted.length * 44 + 80}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 8, right: 40, left: 140, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(138,61,255,0.12)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#a78fbf', fontSize: 12, fontFamily: 'Poppins' }}
            axisLine={{ stroke: 'rgba(138,61,255,0.2)' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="team_name"
            width={135}
            tick={{ fill: '#f0e6ff', fontSize: 12, fontFamily: 'Poppins' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(138,61,255,0.08)' }} />
          <Legend
            wrapperStyle={{ color: '#a78fbf', fontFamily: 'Poppins', fontSize: 13, paddingTop: 12 }}
          />
          <Bar dataKey="avg_goals_scored" name="Scored" fill="#22c55e" fillOpacity={0.85} radius={[0, 4, 4, 0]} />
          <Bar dataKey="avg_goals_conceded" name="Conceded" fill="#ef4444" fillOpacity={0.75} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="analytics__empty">
      <p>No stats recorded yet for this season.</p>
      <span>Stats will appear here as match data is entered in the admin dashboard.</span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [seasonStats, setSeasonStats] = useState([])
  const [gdData, setGdData] = useState([])
  const [loading, setLoading] = useState(true)
  const [group, setGroup] = useState('ALL')

  useEffect(() => {
    Promise.all([fetchAnalyticsSeason(), fetchStandings()])
      .then(([season, standings]) => {
        setSeasonStats(season)
        const all = [...standings.groupA, ...standings.groupB]
        setGdData(all.map(s => ({ name: s.name, gd: s.gd, group: s.slug })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredSeason = group === 'ALL'
    ? seasonStats
    : seasonStats.filter(s => s.group === group)

  const filteredGd = group === 'ALL'
    ? gdData
    : gdData.filter(d => {
        const match = seasonStats.find(s => s.team_name === d.name)
        return match?.group === group
      })

  const hasSeasonData = seasonStats.length > 0

  return (
    <div className="analytics">
      <div className="analytics__container">
        <header className="analytics__header">
          <h1 className="analytics__title">Analytics</h1>
          <p className="analytics__subtitle">2024/25 Season — Nigeria Women Football League</p>
        </header>

        <div className="analytics__filters">
          {['ALL', 'A', 'B'].map(g => (
            <button
              key={g}
              className={`analytics__filter-btn${group === g ? ' analytics__filter-btn--active' : ''}`}
              onClick={() => setGroup(g)}
            >
              {g === 'ALL' ? 'All Teams' : `Group ${g}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="analytics__loading">Loading stats…</div>
        ) : (
          <div className="analytics__grid">
            <section className="analytics__section">
              <GoalDifferenceChart data={filteredGd} />
            </section>

            <section className="analytics__section">
              {hasSeasonData ? (
                <>
                  <CleanSheetsChart data={filteredSeason} />
                  <GoalAveragesChart data={filteredSeason} />
                </>
              ) : (
                <EmptyState />
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
