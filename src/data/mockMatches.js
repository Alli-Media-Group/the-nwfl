// Logo paths — placeholder European club logos until real NWFL logos are available
const L = {
  rivers:      '/team-logos/128x128/roma.football-logos.cc.png',
  edo:         '/team-logos/128x128/lyon.football-logos.cc.png',
  bayelsa:     '/team-logos/128x128/rangers.football-logos.cc.png',
  delta:       '/team-logos/128x128/feyenoord.football-logos.cc.png',
  nasarawa:    '/team-logos/128x128/celtic.football-logos.cc.png',
  confluence:  '/team-logos/128x128/fc-porto.football-logos.cc.png',
  naija:       '/team-logos/128x128/brann.football-logos.cc.png',
  royal:       '/team-logos/128x128/salzburg.football-logos.cc.png',
  osun:        '/team-logos/128x128/genk.football-logos.cc.png',
  fcrobo:      '/team-logos/128x128/lille.football-logos.cc.png',
  adamawa:     '/team-logos/128x128/freiburg.football-logos.cc.png',
  abia:        '/team-logos/128x128/paok.football-logos.cc.png',
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
    awayTeam: 'Royal Queens FC',      awayScore: null, awayLogoUrl: L.royal,
    status: 'UPCOMING', matchday: 'MD 15', date: 'SAT 24 JUNE', time: '14:00',
  },
  {
    id: 6,
    homeTeam: 'Adamawa Queens FC',    homeScore: 0, homeLogoUrl: L.adamawa,
    awayTeam: 'Abia Angels FC',       awayScore: 3, awayLogoUrl: L.abia,
    status: 'FT', matchday: 'MD 14',  date: '2023-05-10',
  },
];
