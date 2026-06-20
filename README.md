# WC 2026 — Schedule & Live Scores

FIFA World Cup 2026 schedule SPA built with Vite + React + Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build
npm run preview
```

## Env

Create `.env.development` and `.env.production` (both gitignored):

| Variable | Dev | Prod |
|---|---|---|
| `VITE_USE_MOCK` | `true` to use mock data, `false` for live | `false` |
| `VITE_LIVE_API_BASE` | `/live` (proxied, avoids CORS) | `https://worldcup26.ir` |

`VITE_USE_MOCK=true` loads everything from `src/data/mockData.js` with zero network calls — good for UI work without burning real requests.

## Data Sources

**`worldcup26.ir`** — primary and only source for fixtures, live scores, standings (computed client-side from fixtures), stadium schedules, and results. Free, no rate limit, no API key.
- `/get/games` — fixtures + live scores
- `/get/teams` — team metadata (flags, codes, groups)
- `/get/stadiums` — venue info (unreliable, has a fallback chain: primary API → jsDelivr CDN mirror → raw GitHub)

**TheSportsDB** (`thesportsdb.com`) — squad rosters + player photos only. Free, keyless. Wired in `src/utils/adapters/sportsDbAdapter.js` / `src/hooks/useSportsDb.js`. Team names occasionally differ from `worldcup26.ir` (e.g. "Bosnia and Herzegovina" vs "Bosnia-Herzegovina") — overrides live in `SPORTSDB_NAME_OVERRIDES` in `src/utils/teams.js`. Add more as mismatches are discovered.

**Not available from any current source:** manager/coach data and match referees. Both UI sections show a permanent "not yet confirmed" placeholder. (API-Football was evaluated and dropped — its free tier blocks `season=2026` entirely, and TheSportsDB has no reliable coach data even for high-profile teams.)

**Wikipedia REST API** — stadium photos in `StadiumsView`, via `useStadiumImage` hook. No key needed, no rate limit found.

## Caching Strategy

Tiered, in `AppContext.jsx`:
- **Tier 1 (forever, localStorage, version-keyed)** — stadiums, team metadata. Bump `CACHE_VERSION` to force a refresh for everyone.
- **Tier 2 (forever once finished, localStorage)** — completed fixtures, merged by match number, never refetched.
- **Tier 3 (sessionStorage, event-triggered)** — upcoming/live fixture shell. Refetches when a cached "upcoming" match's kickoff has passed, a cached "live" match has run past a normal duration, or a 6h fallback TTL expires.
- **Tier 4 (adaptive polling, never cached)** — live score poll. 30s while any match is live or starting within 5 minutes; drops to ~5 min checks otherwise.

Standings are never fetched — always derived from cached fixtures via `computeGroupStandings()` in `src/utils/standings.js`.

## Dev Proxy

`vite.config.js` proxies `/live` → `https://worldcup26.ir` to avoid CORS in development. In production, `VITE_LIVE_API_BASE` points directly at the real domain (whitelisting isn't needed since `worldcup26.ir` allows direct browser calls).

## Stack

- Vite 5 + React 18
- Tailwind CSS 3 — dark navy/gold theme, no border-radius (except `rounded-full`), no box-shadows
- Flags: `flagcdn.com` URLs from team API data (primary), `flag-icons` CSS sprites (fallback when no API flag URL)
- `lucide-react` for all icons — zero emojis anywhere
- React Context + `useReducer` (`src/context/AppContext.jsx`) — no external state library
- No router — `activeTab` in context drives view switching
- Font-scaling accessibility: `data-fontscale` attribute on `<html>`, breakpoint-based default (`sm` under 1024px, `md` above), manual override S/M/L/XL in Settings

## Global Modals & Search Integration

`modalMatchId` and `modalTeamCode` are global state, rendered once at the `AppShell` level in `App.jsx` — this lets search results open the exact match or team modal directly regardless of which tab is active. Stadium search results use `targetStadiumId` + `goToStadium()` to jump the `StadiumsView` slideshow to the exact stadium, consumed via a `useEffect` that resets itself after firing.

## Bracket Predictor

`BracketView.jsx` covers all knockout stages (R32 → R16 → QF → SF → Final). `GroupRankPicker.jsx` lets the user rank 1st/2nd/3rd per group, then pick exactly 8 of the 12 ranked-3rd teams as "best thirds" advancing alongside the 24 group winners/runners-up. `src/utils/bracketResolver.js` resolves placeholder labels (`"Winner Group J"`, `"3rd Group A/B/C/D/F"`, `"Winner Match 86"`) into the user's predicted team names for an interactive predicted bracket.

## Live Animations

- Live score digits / team names: `animate-live-blink` (brightness/saturate pulse, not opacity)
- Live row left border: `live-border-blink`
- Live status dot: `animate-live-pulse`
- Loading state: `animate-loader-box` — staggered scale + color pulse, used in `Loader.jsx`