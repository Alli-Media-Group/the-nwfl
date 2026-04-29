const BASE = '/team-logos/thenwfl_2425_teams';

const L = {
  rivers:     `${BASE}/rivers-angels.png`,
  edo:        `${BASE}/edo-queens.png`,
  bayelsa:    `${BASE}/bayelsa-queens.png`,
  confluence: `${BASE}/confluence-queens.png`,
  nasarawa:   `${BASE}/nasarawa-amazons.png`,
  naija:      `${BASE}/naija-ratels.png`,
  sunshine:   `${BASE}/sunshine-queens.png`,
  heartland:  `${BASE}/heartland-queens.png`,
  abia:       `${BASE}/abia-angels.png`,
  fcrobo:     `${BASE}/fc-robo-queens.png`,
  delta:      `${BASE}/delta-queens.png`,
  adamawa:    `${BASE}/adamawa-queens.png`,
  osun:       `${BASE}/osun-babes.png`,
  ibom:       `${BASE}/ibom-angels.png`,
  dannaz:     `${BASE}/dannaz-ladies.png`,
  ekiti:      `${BASE}/ekiti-queens.png`,
  remo:       `${BASE}/remo-stars-ladies.png`,
};

// NWFL Group A — relegation: bottom 3
export const groupA = [
  { id: 1, name: 'Rivers Angels FC',    mp: 14, w: 9, d: 3, l: 2,  gd: +15, pts: 30, logoUrl: L.rivers    },
  { id: 2, name: 'Edo Queens FC',       mp: 14, w: 8, d: 4, l: 2,  gd: +12, pts: 28, logoUrl: L.edo       },
  { id: 3, name: 'Bayelsa Queens FC',   mp: 14, w: 7, d: 5, l: 2,  gd:  +8, pts: 26, logoUrl: L.bayelsa   },
  { id: 4, name: 'Nasarawa Amazons FC', mp: 14, w: 5, d: 4, l: 5,  gd:  -1, pts: 19, logoUrl: L.nasarawa  },
  { id: 5, name: 'Naija Ratels FC',     mp: 14, w: 4, d: 3, l: 7,  gd:  -5, pts: 15, logoUrl: L.naija     },
  { id: 6, name: 'Sunshine Queens FC',  mp: 14, w: 2, d: 4, l: 8,  gd: -11, pts: 10, logoUrl: L.sunshine  },
  { id: 7, name: 'Abia Angels FC',      mp: 14, w: 2, d: 2, l: 10, gd: -14, pts:  8, logoUrl: L.abia      },
  { id: 8, name: 'Heartland Queens FC', mp: 14, w: 1, d: 3, l: 10, gd: -18, pts:  6, logoUrl: L.heartland },
];

// NWFL Group B — relegation: bottom 4
export const groupB = [
  { id:  9, name: 'FC Robo Queens',      mp: 14, w: 10, d: 2, l: 2, gd: +18, pts: 32, logoUrl: L.fcrobo     },
  { id: 10, name: 'Delta Queens FC',     mp: 14, w:  8, d: 3, l: 3, gd: +10, pts: 27, logoUrl: L.delta      },
  { id: 11, name: 'Adamawa Queens FC',   mp: 14, w:  7, d: 4, l: 3, gd:  +7, pts: 25, logoUrl: L.adamawa    },
  { id: 12, name: 'Confluence Queens FC',mp: 14, w:  6, d: 3, l: 5, gd:  +1, pts: 21, logoUrl: L.confluence  },
  { id: 13, name: 'Ibom Angels FC',      mp: 14, w:  4, d: 2, l: 8, gd:  -7, pts: 14, logoUrl: L.ibom       },
  { id: 14, name: 'Dannaz Ladies FC',    mp: 14, w:  3, d: 3, l: 8, gd:  -9, pts: 12, logoUrl: L.dannaz     },
  { id: 15, name: 'Ekiti Queens FC',     mp: 14, w:  2, d: 3, l: 9, gd: -10, pts:  9, logoUrl: L.ekiti      },
  { id: 16, name: 'Remo Stars Ladies',   mp: 14, w:  2, d: 2, l:10, gd: -14, pts:  8, logoUrl: L.remo       },
];
