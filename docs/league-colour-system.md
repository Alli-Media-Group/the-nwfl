# NWFL League Colour System

> Reference doc for how row colours work in the Standings table.
> This must be followed exactly when building or modifying the StandingsTable component.

---

## Overview

The NWFL has two groups — **Group A** and **Group B**.
Each group has different relegation rules, so the colour thresholds differ between them.

At the end of the season:
- The **top 3** teams in each group qualify for the **Playoffs**
- The **bottom teams** in each group are **relegated** — the cutoff differs per group

---

## Group A

| Position | Colour | Token | Meaning |
|----------|--------|-------|---------|
| 1st – 3rd | Green left border + position badge | `--color-success` `#22c55e` | Qualifies for Playoffs |
| 4th – (n-3)th | No colour | — | Safe / mid-table |
| Last 3 | Red left border + position badge | `--color-danger` `#ef4444` | Relegated |

**Relegation cutoff:** Bottom **3** teams go down.

---

## Group B

| Position | Colour | Token | Meaning |
|----------|--------|-------|---------|
| 1st – 3rd | Green left border + position badge | `--color-success` `#22c55e` | Qualifies for Playoffs |
| 4th – (n-4)th | No colour | — | Safe / mid-table |
| Last 4 | Red left border + position badge | `--color-danger` `#ef4444` | Relegated |

**Relegation cutoff:** Bottom **4** teams go down.

---

## How It Renders in the Table

- The `#` position column gets a **coloured left border** on the row (3px solid)
- The position number itself is displayed inside a **small coloured badge/circle**
  - Green badge → Playoff qualifier
  - Red badge → Relegated
  - No badge → Safe
- Mid-table rows have no border and no badge — just the plain position number

---

## Legend (shown below the table)

Always render a legend beneath the standings table so users understand the colours:

```
🟢  Qualifies for Playoffs
🔴  Relegated
```

---

## Implementation Rules

- **Never hardcode** which rows are green or red by index — derive it from props:
  - `qualifyCount` (always `3` for both groups)
  - `relegationCount` (Group A → `3`, Group B → `4`)
- The component receives the sorted standings array — position is determined by array index
- Use `--color-success` and `--color-danger` tokens — never raw hex in component SCSS
- Both groups share the same `StandingsTable` component; the colour logic adapts via props
