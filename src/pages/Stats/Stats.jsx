import { useEffect, useMemo, useState } from 'react'
import { fetchSeasons, fetchStandings, fetchTopScorers } from '../../lib/api'
import TeamLogo from '../../components/TeamLogo/TeamLogo'
import './Stats.scss'

function Board({ title, note, rows, unit }) {
  return (
    <section className="stats__board">
      <h2 className="stats__board-title">{title}</h2>
      {note && <p className="stats__note">{note}</p>}
      <ol className="stats__list">
        {rows.map((r, i) => (
          <li key={r.key} className="stats__item">
            <span className="stats__rank">{i + 1}</span>
            {r.logo !== undefined && <TeamLogo className="stats__logo" src={r.logo} name={r.team} />}
            <span className="stats__who">
              <span className="stats__name">{r.name}</span>
              {r.team && r.team !== r.name && <span className="stats__team">{r.team}</span>}
            </span>
            <span className="stats__value">
              {r.value}
              {unit && <span className="stats__unit"> {unit}</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Stats() {
  const [seasons, setSeasons] = useState([])
  const [season, setSeason] = useState('')
  const [data, setData] = useState({ season: '', standings: [], scorers: [], failed: false })

  useEffect(() => {
    fetchSeasons()
      .then((s) => {
        const list = [...s].sort().reverse()
        setSeasons(list)
        setSeason(list[0] ?? '')
      })
      .catch(() => setData({ season: '', standings: [], scorers: [], failed: true }))
  }, [])

  useEffect(() => {
    if (!season) return
    let live = true
    Promise.all([fetchStandings(season), fetchTopScorers(season)])
      .then(([groups, scorers]) => live && setData({ season, standings: [...groups.groupA, ...groups.groupB], scorers, failed: false }))
      .catch(() => live && setData({ season, standings: [], scorers: [], failed: true }))
    return () => { live = false }
  }, [season])

  const { standings, scorers } = data
  const loading = data.season !== season
  const error = data.failed

  const boards = useMemo(() => {
    const top = (rows, by, dir = -1) =>
      [...rows].filter((t) => t.mp > 0).sort((a, b) => dir * (by(a) - by(b))).slice(0, 5)
    const team = (t, value) => ({ key: t.id, name: t.name, logo: t.logoUrl, team: t.name, value })
    return {
      scorers: scorers.slice(0, 10).map((s) => ({ key: `${s.team_slug}-${s.name}`, name: s.name, team: s.team, value: s.goals })),
      attack: top(standings, (t) => t.gf).map((t) => team(t, t.gf)),
      defence: top(standings, (t) => t.ga, 1).map((t) => team(t, t.ga)),
      wins: top(standings, (t) => t.w).map((t) => team(t, t.w)),
      perGame: top(standings, (t) => t.gf / t.mp).map((t) => team(t, (t.gf / t.mp).toFixed(2))),
    }
  }, [standings, scorers])

  return (
    <main className="stats">
      <div className="stats__container">
        <header className="stats__header">
          <div>
            <h1 className="stats__title">Stats</h1>
            <p className="stats__subtitle">The leaders of the season, in goals and results.</p>
          </div>
          <select className="stats__select" aria-label="Season" value={season} onChange={(e) => setSeason(e.target.value)}>
            {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </header>

        {error ? (
          <p className="stats__empty">The stats could not be loaded. Please refresh the page.</p>
        ) : loading ? (
          <p className="stats__empty">Loading stats…</p>
        ) : (
          <div className="stats__grid">
            <Board title="Top scorers" rows={boards.scorers} unit="goals" />
            <Board title="Best attack" note="Most goals scored" rows={boards.attack} unit="goals" />
            <Board title="Best defence" note="Fewest goals conceded" rows={boards.defence} unit="conceded" />
            <Board title="Most wins" rows={boards.wins} unit="wins" />
            <Board title="Goals per game" note="Average goals scored in each match played" rows={boards.perGame} />
          </div>
        )}
      </div>
    </main>
  )
}
