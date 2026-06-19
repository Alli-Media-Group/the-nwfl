import { useEffect, useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from 'recharts'
import {
  fetchAnalyticsSeason,
  fetchGoalDistribution,
  fetchPositionTrends,
  fetchSeasons,
  fetchStandings,
  fetchTopScorers,
} from '../../lib/api'
import './Analytics.scss'

const RESULT_COLORS = { W: '#22c55e', D: '#f59e0b', L: '#ef4444' }

// ── Helpers ───────────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="analytics__tooltip">
      <p className="analytics__tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <section className="analytics__section">
      <div className="analytics__section-header">
        <h2 className="analytics__section-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Card({ children, className = '' }) {
  return <div className={`analytics__card ${className}`.trim()}>{children}</div>
}

function EmptyState({ message }) {
  return (
    <Card>
      <div className="analytics__empty">
        <p>{message}</p>
      </div>
    </Card>
  )
}

function TeamLogo({ slug, name }) {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <div className="analytics__logo-fallback">
        {name.slice(0, 2).toUpperCase()}
      </div>
    )
  }
  return (
    <img
      src={`/team-logos/thenwfl_2425_teams/${slug}.png`}
      alt={name}
      className="analytics__logo"
      onError={() => setError(true)}
    />
  )
}

// ── League Table ──────────────────────────────────────────────────────────────
function LeagueTable({ standings }) {
  const sorted = useMemo(
    () => [...standings].sort((a, b) => (b.pts - a.pts) || (b.gd - a.gd)),
    [standings]
  )

  if (!sorted.length) return <EmptyState message="No standings data for this season." />

  return (
    <Card>
      <div className="analytics__table-wrap">
        <table className="analytics__table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Pts</th>
              <th>Form</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const qualify = i < 3
              const relegate = i >= sorted.length - (row.group === 'A' ? 3 : 4)
              return (
                <tr key={row.id}>
                  <td>
                    <span className={`analytics__position ${qualify ? 'analytics__position--qualify' : ''} ${relegate ? 'analytics__position--relegate' : ''}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td>
                    <div className="analytics__team-cell">
                      <TeamLogo slug={row.slug} name={row.name} />
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td>{row.mp}</td>
                  <td>{row.w}</td>
                  <td>{row.d}</td>
                  <td>{row.l}</td>
                  <td>{row.gf}</td>
                  <td>{row.ga}</td>
                  <td className={row.gd > 0 ? 'analytics__positive' : row.gd < 0 ? 'analytics__negative' : ''}>
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="analytics__pts">{row.pts}</td>
                  <td>
                    <div className="analytics__form">
                      {(row.form ?? []).slice(-5).map((r, idx) => (
                        <span key={idx} className="analytics__form-dot" style={{ background: RESULT_COLORS[r] }} title={r}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ── Stat Leader Cards ─────────────────────────────────────────────────────────
function LeaderCards({ standings, seasonStats, topScorer }) {
  const bestAttack = useMemo(
    () => [...standings].sort((a, b) => b.gf - a.gf)[0],
    [standings]
  )
  const bestDefence = useMemo(
    () => [...standings].sort((a, b) => a.ga - b.ga)[0],
    [standings]
  )
  const mostCleanSheets = useMemo(
    () => [...seasonStats].sort((a, b) => b.clean_sheets - a.clean_sheets)[0],
    [seasonStats]
  )

  const cards = [
    { label: 'Best Attack', value: bestAttack?.gf ?? '—', sub: bestAttack?.name ?? '—', color: '#22c55e' },
    { label: 'Best Defence', value: bestDefence?.ga ?? '—', sub: bestDefence?.name ?? '—', color: '#22D3EE' },
    { label: 'Most Clean Sheets', value: mostCleanSheets?.clean_sheets ?? '—', sub: mostCleanSheets?.team_name ?? '—', color: '#8A3DFF' },
    { label: 'Top Scorer', value: topScorer?.goals ?? '—', sub: topScorer?.name ?? '—', color: '#f59e0b' },
  ]

  return (
    <div className="analytics__leader-grid">
      {cards.map((card) => (
        <Card key={card.label}>
          <div className="analytics__leader-card">
            <span className="analytics__leader-label">{card.label}</span>
            <div className="analytics__leader-value" style={{ color: card.color }}>{card.value}</div>
            <span className="analytics__leader-sub">{card.sub}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ── Top Scorers ───────────────────────────────────────────────────────────────
function TopScorers({ scorers }) {
  if (!scorers.length) return <EmptyState message="No goals recorded for this season." />

  return (
    <Card>
      <div className="analytics__scorers">
        {scorers.slice(0, 10).map((s, i) => (
          <div key={`${s.name}-${s.team}`} className="analytics__scorer-row">
            <span className="analytics__scorer-rank">{i + 1}</span>
            <div className="analytics__scorer-info">
              <span className="analytics__scorer-name">{s.name}</span>
              <span className="analytics__scorer-team">{s.team}</span>
            </div>
            <span className="analytics__scorer-goals">{s.goals}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Goal Distribution Chart ───────────────────────────────────────────────────
function GoalDistributionChart({ data }) {
  const chartData = useMemo(() => {
    const order = ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90', '90+']
    return order.map((bucket) => ({ bucket, goals: data[bucket] ?? 0 }))
  }, [data])

  if (!chartData.some((d) => d.goals > 0)) {
    return <EmptyState message="No goal timing data available." />
  }

  return (
    <Card>
      <h3 className="analytics__chart-title">Goals by Time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(138,61,255,0.12)" vertical={false} />
          <XAxis dataKey="bucket" tick={{ fill: '#a78fbf', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#a78fbf', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(138,61,255,0.08)' }} />
          <Bar dataKey="goals" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={i < 3 ? '#8A3DFF' : i < 6 ? '#6A2BD9' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Position Trends Chart ─────────────────────────────────────────────────────
function PositionTrendsChart({ data, group }) {
  const { teams, matchdays } = useMemo(() => {
    const all = data?.trends ?? {}
    const names = data?.teams ?? Object.keys(all)
    const maxGw = Math.max(0, ...Object.values(all).map((arr) => arr.length))
    const chartRows = []
    for (let gw = 1; gw <= maxGw; gw++) {
      const row = { gw: `MD${gw}` }
      names.forEach((name) => {
        row[name] = all[name]?.[gw - 1] ?? null
      })
      chartRows.push(row)
    }
    return { teams: names, matchdays: chartRows }
  }, [data])

  if (!teams.length) return <EmptyState message={`No position trend data for Group ${group}.`} />

  const colors = ['#8A3DFF', '#22D3EE', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1']

  return (
    <Card>
      <h3 className="analytics__chart-title">Position Trends — Group {group}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={matchdays} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(138,61,255,0.12)" />
          <XAxis dataKey="gw" tick={{ fill: '#a78fbf', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis reversed domain={[1, 'dataMax + 1']} tick={{ fill: '#a78fbf', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ color: '#a78fbf', fontSize: 12, paddingTop: 12 }} />
          {teams.slice(0, 8).map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Form Guide ─────────────────────────────────────────────────────────────────
function FormGuide({ standings }) {
  if (!standings.length) return <EmptyState message="No form data available." />

  return (
    <Card>
      <h3 className="analytics__chart-title">Form Guide</h3>
      <div className="analytics__form-list">
        {standings
          .sort((a, b) => (b.pts - a.pts) || (b.gd - a.gd))
          .map((team) => (
            <div key={team.id} className="analytics__form-team">
              <div className="analytics__form-team-info">
                <TeamLogo slug={team.slug} name={team.name} />
                <span>{team.name}</span>
              </div>
              <div className="analytics__form-results">
                {(team.form ?? []).slice(-5).map((r, i) => (
                  <span key={i} className="analytics__form-result" style={{ background: RESULT_COLORS[r] }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </Card>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [seasons, setSeasons] = useState([])
  const [season, setSeason] = useState('')
  const [group, setGroup] = useState('ALL')
  const [standings, setStandings] = useState([])
  const [seasonStats, setSeasonStats] = useState([])
  const [scorers, setScorers] = useState([])
  const [goalDist, setGoalDist] = useState(null)
  const [trendsA, setTrendsA] = useState(null)
  const [trendsB, setTrendsB] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSeasons()
      .then((list) => {
        setSeasons(list)
        if (list.length) setSeason(list[0])
      })
      .catch(() => setSeason('2024/25'))
  }, [])

  useEffect(() => {
    if (!season) return

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [standingsData, stats, topScorersData, goals, posA, posB] = await Promise.all([
          fetchStandings(season),
          fetchAnalyticsSeason(season),
          fetchTopScorers(season),
          fetchGoalDistribution(season),
          fetchPositionTrends('A', season),
          fetchPositionTrends('B', season),
        ])
        if (cancelled) return
        const all = [...standingsData.groupA, ...standingsData.groupB]
        setStandings(all)
        setSeasonStats(stats)
        setScorers(topScorersData)
        setGoalDist(goals)
        setTrendsA(posA)
        setTrendsB(posB)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load analytics.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [season])

  const filteredStandings = useMemo(() => {
    if (group === 'ALL') return standings
    return standings.filter((s) => s.group === group)
  }, [standings, group])

  const filteredStats = useMemo(() => {
    if (group === 'ALL') return seasonStats
    return seasonStats.filter((s) => s.group === group)
  }, [seasonStats, group])

  const topScorer = scorers[0]

  if (loading && !standings.length) {
    return (
      <div className="analytics">
        <div className="analytics__container">
          <div className="analytics__loading">Loading analytics…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics">
      <div className="analytics__container">
        <header className="analytics__header">
          <div>
            <h1 className="analytics__title">Analytics</h1>
            <p className="analytics__subtitle">Season insights, form, and trends</p>
          </div>
          <div className="analytics__controls">
            <select
              className="analytics__select"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              {seasons.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="analytics__filters">
              {['ALL', 'A', 'B'].map((g) => (
                <button
                  key={g}
                  className={`analytics__filter-btn${group === g ? ' analytics__filter-btn--active' : ''}`}
                  onClick={() => setGroup(g)}
                >
                  {g === 'ALL' ? 'All Teams' : `Group ${g}`}
                </button>
              ))}
            </div>
          </div>
        </header>

        {error ? (
          <div className="analytics__error">{error}</div>
        ) : (
          <div className="analytics__dashboard">
            <LeaderCards standings={filteredStandings} seasonStats={filteredStats} topScorer={topScorer} />

            <div className="analytics__main-grid">
              <div className="analytics__column analytics__column--wide">
                <Section title="League Table">
                  <LeagueTable standings={filteredStandings} />
                </Section>

                <Section title="Position Trends">
                  <div className="analytics__trends-grid">
                    <PositionTrendsChart data={trendsA} group="A" />
                    <PositionTrendsChart data={trendsB} group="B" />
                  </div>
                </Section>
              </div>

              <div className="analytics__column">
                <Section title="Top Scorers">
                  <TopScorers scorers={scorers} />
                </Section>

                <Section title="Form Guide">
                  <FormGuide standings={filteredStandings} />
                </Section>

                <Section title="Goal Timing">
                  <GoalDistributionChart data={goalDist} />
                </Section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
