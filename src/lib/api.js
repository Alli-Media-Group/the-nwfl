const API_BASE = import.meta.env.VITE_API_URL || ''

// ── Core fetch ────────────────────────────────────────────────────────────────
async function get(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : (data.results ?? data)
}


// ── Adapters — map API shape → component shape ────────────────────────────────

// Standing row from /api/standings/
// API: { id, team: { id, name, slug, group, short_name, ... }, played, won, drawn, lost, gf, ga, gd, points, form }
// Component expects: { id, name, logoUrl, mp, w, d, l, gd, pts }
function adaptStanding(s) {
  return {
    id:      s.team.id,
    name:    s.team.name,
    slug:    s.team.slug,
    logoUrl: s.team.logo_url || null,
    mp:      s.played,
    w:       s.won,
    d:       s.drawn,
    l:       s.lost,
    gf:      s.gf,
    ga:      s.ga,
    gd:      s.gd,
    pts:     s.points,
    form:    s.form ?? [],
  }
}

// Match from /api/matches/
// API: { id, home_team: { name, slug }, away_team: { name, slug }, home_score, away_score, matchday, date, kick_off, status }
// Component expects: { id, homeTeam, awayTeam, homeScore, awayScore, homeLogoUrl, awayLogoUrl, matchday, date, time, status }
function adaptMatch(m) {
  return {
    id:           m.id,
    homeTeam:     m.home_team.name,
    awayTeam:     m.away_team.name,
    homeShortName: m.home_team.short_name || m.home_team.name,
    awayShortName: m.away_team.short_name || m.away_team.name,
    homeScore:    m.home_score,
    awayScore:    m.away_score,
    homeLogoUrl:  m.home_team.logo_url || null,
    awayLogoUrl:  m.away_team.logo_url || null,
    matchday:     m.matchday != null ? `MD ${m.matchday}` : null,
    date:         m.date ?? null,
    time:         m.kick_off ? m.kick_off.slice(0, 5) : null,
    venue:        m.venue || null,
    status:       m.status,
    group:        m.home_team.group,
  }
}

// Team from /api/teams/ merged with standing from /api/standings/
// Component expects: { id, slug, name, shortName, city, state, group, logoUrl, founded,
//                      manager, bio, honours, form, position, points, w, d, l, nextMatch }
function adaptTeam(t, standingsMap, nextMatchMap) {
  const standing = standingsMap[t.id]
  return {
    id:        t.id,
    slug:      t.slug,
    name:      t.name,
    shortName: t.short_name,
    city:      t.city,
    state:     t.state,
    group:     t.group,
    logoUrl:   t.logo_url || null,
    founded:   t.founded ?? null,
    manager:   t.manager || null,
    bio:       t.bio || '',
    honours:   t.titles > 0 ? [`${t.titles}× NWFL Champions`] : [],
    form:      standing?.form ?? [],
    position:  standing ? null : null, // computed by caller after sort
    points:    standing?.pts ?? 0,
    w:         standing?.w  ?? 0,
    d:         standing?.d  ?? 0,
    l:         standing?.l  ?? 0,
    gd:        standing?.gd ?? 0,
    nextMatch: nextMatchMap[t.id] ?? null,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchStandings(season) {
  const qs = season ? `?season=${encodeURIComponent(season)}` : ''
  const rows = await get(`/api/standings/${qs}`)
  const adapted = rows.map(adaptStanding)
  const groupA = adapted.filter(s => {
    const row = rows.find(r => r.team.id === s.id)
    return row?.team.group === 'A'
  })
  const groupB = adapted.filter(s => {
    const row = rows.find(r => r.team.id === s.id)
    return row?.team.group === 'B'
  })
  // Sort by points desc, then gd desc
  const sort = arr => [...arr].sort((a, b) => (b.pts - a.pts) || (b.gd - a.gd))
  return { groupA: sort(groupA), groupB: sort(groupB) }
}

export async function fetchMatches(season) {
  const qs = season ? `?season=${encodeURIComponent(season)}` : ''
  const rows = await get(`/api/matches/${qs}`)
  return rows.map(adaptMatch)
}

export async function fetchSeasons() {
  return get('/api/matches/seasons/')
}

export async function fetchAnalyticsSeason() {
  const rows = await get('/api/analytics/season/')
  return rows
}

export async function fetchTeams(season) {
  const qs = season ? `?season=${encodeURIComponent(season)}` : ''
  const [teams, standings, matches] = await Promise.all([
    get('/api/teams/'),
    get(`/api/standings/${qs}`),
    get(`/api/matches/${qs}`),
  ])

  // Build standings lookup by team id
  const standingsMap = {}
  for (const s of standings) {
    standingsMap[s.team.id] = adaptStanding(s)
  }

  // Build "next upcoming match" label per team
  const now = new Date()
  const upcoming = matches
    .filter(m => m.status === 'UPCOMING')
    .sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(a.date) - new Date(b.date)
    })

  const nextMatchMap = {}
  for (const m of upcoming) {
    const homeId = m.home_team.id
    const awayId = m.away_team.id
    if (!nextMatchMap[homeId]) {
      nextMatchMap[homeId] = `vs ${m.away_team.name} · MD ${m.matchday}`
    }
    if (!nextMatchMap[awayId]) {
      nextMatchMap[awayId] = `vs ${m.home_team.name} · MD ${m.matchday}`
    }
  }

  const adapted = teams.map(t => adaptTeam(t, standingsMap, nextMatchMap))

  // Assign position within each group by points
  const assignPositions = arr => {
    const sorted = [...arr].sort((a, b) => (b.points - a.points) || (b.gd - a.gd))
    return sorted.map((t, i) => ({ ...t, position: i + 1 }))
  }

  const groupA = assignPositions(adapted.filter(t => t.group === 'A'))
  const groupB = assignPositions(adapted.filter(t => t.group === 'B'))

  return [...groupA, ...groupB]
}
