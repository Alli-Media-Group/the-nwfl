const BASE = '/team-logos/thenwfl_2425_teams';

const L = {
  rivers:     `${BASE}/rivers-angels.png`,
  edo:        `${BASE}/edo-queens.png`,
  bayelsa:    `${BASE}/bayelsa-queens.png`,
  delta:      `${BASE}/delta-queens.png`,
  nasarawa:   `${BASE}/nasarawa-amazons.png`,
  confluence: `${BASE}/confluence-queens.png`,
  naija:      `${BASE}/naija-ratels.png`,
  fcrobo:     `${BASE}/fc-robo-queens.png`,
  osun:       `${BASE}/osun-babes.png`,
  adamawa:    `${BASE}/adamawa-queens.png`,
  abia:       `${BASE}/abia-angels.png`,
  sunshine:   `${BASE}/sunshine-queens.png`,
};

export const mockMatches = [
  {
    id: 1,
    homeTeam: 'Rivers Angels FC',     homeScore: 2, homeLogoUrl: L.rivers,
    awayTeam: 'Edo Queens FC',        awayScore: 1, awayLogoUrl: L.edo,
    status: 'FT', matchday: 'MD 14',  date: '2023-05-10',
  },
  {
    id: 2,
    homeTeam: 'Bayelsa Queens FC',    homeScore: null, homeLogoUrl: L.bayelsa,
    awayTeam: 'Delta Queens FC',      awayScore: null, awayLogoUrl: L.delta,
    status: 'UPCOMING', matchday: 'MD 15', date: 'SAT 24 JUNE', time: '16:00',
  },
  {
    id: 3,
    homeTeam: 'Nasarawa Amazons FC',  homeScore: 0, homeLogoUrl: L.nasarawa,
    awayTeam: 'Confluence Queens FC', awayScore: 0, awayLogoUrl: L.confluence,
    status: 'FT', matchday: 'MD 14',  date: '2023-05-10',
  },
  {
    id: 4,
    homeTeam: 'Naija Ratels FC',      homeScore: 1, homeLogoUrl: L.naija,
    awayTeam: 'FC Robo Queens',       awayScore: 2, awayLogoUrl: L.fcrobo,
    status: 'FT', matchday: 'MD 14',  date: '2023-05-10',
  },
  {
    id: 5,
    homeTeam: 'Osun Babes FC',        homeScore: null, homeLogoUrl: L.osun,
    awayTeam: 'Adamawa Queens FC',    awayScore: null, awayLogoUrl: L.adamawa,
    status: 'UPCOMING', matchday: 'MD 15', date: 'SAT 24 JUNE', time: '14:00',
  },
  {
    id: 6,
    homeTeam: 'Abia Angels FC',       homeScore: 0, homeLogoUrl: L.abia,
    awayTeam: 'Sunshine Queens FC',   awayScore: 1, awayLogoUrl: L.sunshine,
    status: 'FT', matchday: 'MD 14',  date: '2023-05-10',
  },
];
