// Logo paths — placeholder European club logos until real NWFL logos are available
const L = {
  rivers:      '/team-logos/128x128/roma.football-logos.cc.png',
  edo:         '/team-logos/128x128/lyon.football-logos.cc.png',
  bayelsa:     '/team-logos/128x128/rangers.football-logos.cc.png',
  naija:       '/team-logos/128x128/brann.football-logos.cc.png',
  nasarawa:    '/team-logos/128x128/celtic.football-logos.cc.png',
  confluence:  '/team-logos/128x128/fc-porto.football-logos.cc.png',
  royal:       '/team-logos/128x128/salzburg.football-logos.cc.png',
  sunshine:    '/team-logos/128x128/panathinaikos.football-logos.cc.png',
  abia:        '/team-logos/128x128/paok.football-logos.cc.png',
  fcrobo:      '/team-logos/128x128/lille.football-logos.cc.png',
  delta:       '/team-logos/128x128/feyenoord.football-logos.cc.png',
  adamawa:     '/team-logos/128x128/freiburg.football-logos.cc.png',
  osun:        '/team-logos/128x128/genk.football-logos.cc.png',
  pelican:     '/team-logos/128x128/sc-braga.football-logos.cc.png',
  ibom:        '/team-logos/128x128/fenerbahce.football-logos.cc.png',
  dreamstar:   '/team-logos/128x128/midtjylland.football-logos.cc.png',
  edoB:        '/team-logos/128x128/bologna.football-logos.cc.png',
  akwa:        '/team-logos/128x128/malmo.football-logos.cc.png',
  kaduna:      '/team-logos/128x128/nice.football-logos.cc.png',
};

// NWFL Group A — relegation: bottom 3
export const groupA = [
  { id: 1,  name: 'Rivers Angels FC',      mp: 14, w: 9, d: 3, l: 2,  gd: +15, pts: 30, logoUrl: L.rivers     },
  { id: 2,  name: 'Edo Queens FC',         mp: 14, w: 8, d: 4, l: 2,  gd: +12, pts: 28, logoUrl: L.edo        },
  { id: 3,  name: 'Bayelsa Queens FC',     mp: 14, w: 7, d: 5, l: 2,  gd:  +8, pts: 26, logoUrl: L.bayelsa    },
  { id: 4,  name: 'Confluence Queens FC',  mp: 14, w: 6, d: 3, l: 5,  gd:  +2, pts: 21, logoUrl: L.confluence  },
  { id: 5,  name: 'Nasarawa Amazons FC',   mp: 14, w: 5, d: 4, l: 5,  gd:  -1, pts: 19, logoUrl: L.nasarawa   },
  { id: 6,  name: 'Naija Ratels FC',       mp: 14, w: 4, d: 3, l: 7,  gd:  -5, pts: 15, logoUrl: L.naija      },
  { id: 7,  name: 'Royal Queens FC',       mp: 14, w: 4, d: 2, l: 8,  gd:  -6, pts: 14, logoUrl: L.royal      },
  { id: 8,  name: 'Sunshine Queens FC',    mp: 14, w: 2, d: 4, l: 8,  gd: -11, pts: 10, logoUrl: L.sunshine   },
  { id: 9,  name: 'Abia Angels FC',        mp: 14, w: 1, d: 3, l: 10, gd: -18, pts:  6, logoUrl: L.abia       },
];

// NWFL Group B — relegation: bottom 4
export const groupB = [
  { id: 10, name: 'FC Robo Queens',        mp: 14, w: 10, d: 2, l: 2, gd: +18, pts: 32, logoUrl: L.fcrobo     },
  { id: 11, name: 'Delta Queens FC',       mp: 14, w:  8, d: 3, l: 3, gd: +10, pts: 27, logoUrl: L.delta      },
  { id: 12, name: 'Adamawa Queens FC',     mp: 14, w:  7, d: 4, l: 3, gd:  +7, pts: 25, logoUrl: L.adamawa    },
  { id: 13, name: 'Osun Babes FC',         mp: 14, w:  6, d: 3, l: 5, gd:  +1, pts: 21, logoUrl: L.osun       },
  { id: 14, name: 'Pelican Stars FC',      mp: 14, w:  4, d: 5, l: 5, gd:  -2, pts: 17, logoUrl: L.pelican    },
  { id: 15, name: 'Ibom Angels FC',        mp: 14, w:  4, d: 2, l: 8, gd:  -7, pts: 14, logoUrl: L.ibom       },
  { id: 16, name: 'Dreamstar FC',          mp: 14, w:  3, d: 3, l: 8, gd:  -9, pts: 12, logoUrl: L.dreamstar  },
  { id: 17, name: 'Edo Queens B',          mp: 14, w:  2, d: 3, l: 9, gd: -10, pts:  9, logoUrl: L.edoB       },
  { id: 18, name: 'Akwa Queens FC',        mp: 14, w:  2, d: 2, l:10, gd: -14, pts:  8, logoUrl: L.akwa       },
  { id: 19, name: 'Kaduna Queens FC',      mp: 14, w:  1, d: 3, l:10, gd: -18, pts:  6, logoUrl: L.kaduna     },
];
