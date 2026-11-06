import { useEffect, useMemo, useState } from 'react'
import { fetchMatches, fetchSeasons } from '../../lib/api'
import TeamLogo from '../../components/TeamLogo/TeamLogo'
import './MatchCenter.scss'

const TABS = [
  { key: 'results', label: 'Results' },
  { key: 'fixtures', label: 'Fixtures' },
]

const formatDay = (iso) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date to be confirmed'

// The matchday the page opens on: results show the latest first, fixtures the next one first.
function groupByMatchday(matches, newestFirst) {
  const groups = new Map()
  for (const m of matches) {
    const key = m.matchday ?? 'Other'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(m)
  }
  const num = (k) => (k === 'Other' ? -1 : parseInt(String(k).replace(/\D/g, ''), 10) || 0)
  return [...groups.entries()]
    .sort((a, b) => (newestFirst ? num(b[0]) - num(a[0]) : num(a[0]) - num(b[0])))
    .map(([matchday, list]) => ({
      matchday,
      list: [...list].sort((a, b) => {
        const d = (a.date ?? '').localeCompare(b.date ?? '')
        return newestFirst ? -d : d
      }),
    }))
}

function MatchRow({ m }) {
  const played = m.status === 'FT'
  return (
    <li className="match-center__row">
      <span className="match-center__when">
        {formatDay(m.date)}
        {m.time ? ` · ${m.time}` : ''}
      </span>
      <div className="match-center__teams">
        <span className="match-center__team match-center__team--home">
          <span className="match-center__team-name">{m.homeTeam}</span>
          <TeamLogo className="match-center__logo" src={m.homeLogoUrl} name={m.homeTeam} shortName={m.homeShortName} />
        </span>
        <span className={`match-center__score${played ? '' : ' match-center__score--pending'}`}>
          {played ? `${m.homeScore} – ${m.awayScore}` : 'v'}
        </span>
        <span className="match-center__team match-center__team--away">
          <TeamLogo className="match-center__logo" src={m.awayLogoUrl} name={m.awayTeam} shortName={m.awayShortName} />
          <span className="match-center__team-name">{m.awayTeam}</span>
        </span>
      </div>
      <span className="match-center__venue">{m.venue ?? ''}</span>
    </li>
  )
}

export default function MatchCenter() {
  const [seasons, setSeasons] = useState([])
  const [season, setSeason] = useState('')
  const [data, setData] = useState({ season: '', matches: [], failed: false })
  const [tab, setTab] = useState('results')
  const [team, setTeam] = useState('')

  useEffect(() => {
    fetchSeasons()
      .then((s) => {
        const list = [...s].sort().reverse()
        setSeasons(list)
        setSeason(list[0] ?? '')
      })
      .catch(() => setData({ season: '', matches: [], failed: true }))
  }, [])

  useEffect(() => {
    if (!season) return
    let live = true
    fetchMatches(season)
      .then((matches) => live && setData({ season, matches, failed: false }))
      .catch(() => live && setData({ season, matches: [], failed: true }))
    return () => { live = false }
  }, [season])

  const { matches } = data
  const loading = data.season !== season
  const error = data.failed

  const teams = useMemo(
    () => [...new Set(matches.flatMap((m) => [m.homeTeam, m.awayTeam]))].sort(),
    [matches]
  )

  const shown = useMemo(() => {
    const wantPlayed = tab === 'results'
    const rows = matches.filter(
      (m) => (m.status === 'FT') === wantPlayed && (!team || m.homeTeam === team || m.awayTeam === team)
    )
    return groupByMatchday(rows, wantPlayed)
  }, [matches, tab, team])

  const counts = useMemo(
    () => ({
      results: matches.filter((m) => m.status === 'FT').length,
      fixtures: matches.filter((m) => m.status !== 'FT').length,
    }),
    [matches]
  )

  return (
    <main className="match-center">
      <div className="match-center__container">
        <header className="match-center__header">
          <div>
            <h1 className="match-center__title">Match Center</h1>
            <p className="match-center__subtitle">Every result and fixture of the Nigeria Women Football League.</p>
          </div>
          <div className="match-center__filters">
            <select className="match-center__select" aria-label="Season" value={season} onChange={(e) => setSeason(e.target.value)}>
              {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="match-center__select" aria-label="Team" value={team} onChange={(e) => setTeam(e.target.value)}>
              <option value="">All teams</option>
              {teams.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </header>

        <div className="match-center__tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={`match-center__tab${tab === t.key ? ' is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label} <span className="match-center__count">{counts[t.key]}</span>
            </button>
          ))}
        </div>

        {error ? (
          <p className="match-center__empty">The matches could not be loaded. Please refresh the page.</p>
        ) : loading ? (
          <p className="match-center__empty">Loading matches…</p>
        ) : shown.length === 0 ? (
          <p className="match-center__empty">
            {tab === 'results' ? 'No results for this selection.' : 'No fixtures scheduled for this selection.'}
          </p>
        ) : (
          shown.map((g) => (
            <section key={g.matchday} className="match-center__group">
              <h2 className="match-center__group-title">{g.matchday}</h2>
              <ul className="match-center__list">
                {g.list.map((m) => <MatchRow key={m.id} m={m} />)}
              </ul>
            </section>
          ))
        )}
      </div>
    </main>
  )
}
