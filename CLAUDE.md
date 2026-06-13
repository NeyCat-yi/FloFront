# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

铅锌矿浮选智能检测与决策系统 (Lead-Zinc Flotation Intelligent Detection & Decision System) — a dark-themed industrial dashboard for monitoring and controlling a lead-zinc flotation process. Uses a **"Deep Mining Control Center"** design aesthetic (frosted glass panels, layered gradient backgrounds, cyan glow accents, tech-inspired fonts).

Backend API is proxied via Vite to `http://localhost:8000` (see `vite.config.js`). Components call `src/api.js` which wraps `/api/*` endpoints; when the API is unavailable, some components show empty states or use mock fallback data.

## Commands

- `npm run dev` — start Vite dev server (proxies `/api` to `localhost:8000`)
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

No test framework is configured.

## Tech Stack

- **React 19** + **Vite 8** (Oxc via @vitejs/plugin-react)
- **Ant Design 6** — dark theme (`theme.darkAlgorithm`), Chinese locale (`zhCN`), primary `#4fc3f7`
- **ECharts 6** — initialized with `'dark'` theme and `backgroundColor: 'transparent'`, used directly (not via echarts-for-react)
- **react-router-dom v7** — two routes: `/` (dashboard) and `/reagent-optimization`
- **hls.js** — for HLS camera streams (dynamically imported)
- **No TypeScript** — all `.jsx` files
- **Google Fonts** — Rajdhani (display/headings), JetBrains Mono (data/numbers), loaded via `index.html`

## Architecture

### Design System (`App.css`)

CSS custom properties in `:root` define the entire design token system — colors, typography, radii, spacing. All components reference these variables (e.g., `var(--accent)`, `var(--font-mono)`, `var(--bg-card)`).

Key patterns:
- **`.panel` / `.panel-inner`** — frosted glass card wrapper (`backdrop-filter: blur(16px)`) with staggered fade-in animation
- **`.section-title`** — left-bordered accent heading used across all panels
- **`.reagent-panel` / `.reagent-title`** — same glass card but for the reagent optimization sub-page
- **Ant Design overrides** — Table headers use `var(--font-display)`, body cells use `var(--font-mono)`

### Routing & Layout (`App.jsx`)

`ConfigProvider` wraps everything with dark theme tokens. Two routes inside `BrowserRouter`:
- `/` → `Dashboard` — CSS Grid (3-col × 3-row: 30%/35%/35% × 40%/30%/30%), each cell wraps a component in a `.panel`
- `/reagent-optimization` → `ReagentOptimization` — standalone flex layout with its own grid system

### Dashboard Grid Cells

| Cell | Grid Position | Component | Content |
|------|--------------|-----------|---------|
| `cell-flow` | cols 1-2, row 1 | `FlowChart` | ECharts graph of flotation process |
| `cell-camera` | col 1, rows 2-3 | `CameraFeed` | 2×2 HLS video grid |
| `cell-param` | col 2, rows 2-3 | `ParamTable` | Editable reagent table (Ant Table) |
| `cell-monitor` | col 3, row 1 | `ProcessInfo` | Metric info cards from API |
| `cell-grade` | col 3, row 2 | `GradeSoftMeasure` | Gauge charts + grade readings |
| `cell-chart` | col 3, row 3 | `RunLog` | Chronological operation log |

`Navbar` sits above the grid with dropdown menus; "药剂优化" navigates to `/reagent-optimization`.

### API Layer (`src/api.js`)

Centralized fetch wrapper with endpoints grouped by domain:
- `floBasic` — process info (grades, ore volume, energy)
- `floRegent` — reagent dosing (get/add)
- `floVideo` — camera stream URLs
- `floImageFeat` — image feature extraction
- `floAlgo` — algorithm execution and listing
- `floUser` — user CRUD

### Mock Data (`src/mock/data.js`)

Randomized data generators for components not yet fully wired to the API. Used by `GradeSoftMeasure` and `Navbar` menu items.

### ECharts Pattern

All ECharts instances follow the same lifecycle:
1. `useRef` for DOM element and chart instance
2. `echarts.init(ref, 'dark')` with `backgroundColor: 'transparent'`
3. `chart.setOption(...)` with theme-consistent colors
4. `window.addEventListener('resize', ...)` for responsive sizing
5. Cleanup: `chart.dispose()` in `useEffect` return

### Component Polling

Components that auto-refresh use `setInterval` with cleanup:
- `ProcessInfo`: 5s
- `ParamTable`: 5s
- `GradeSoftMeasure`: 3s
- `RunLog`: 4s
- `ReagentOptimization` (regent): 5s

## Conventions

- All UI text is in Chinese.
- ECharts chart colors reference `#4fc3f7` (cyan), `#ffb74d` (amber/lead), `#ef5350` (red/zinc), `#66bb6a` (green).
- Inline styles use CSS variables via string values (e.g., `color: 'var(--accent)'`) — this works at runtime but IDEs may not resolve them.
- Font stack: `--font-display` for headings/menus, `--font-mono` for data values, `--font-body` for general text.

## rule

- 每次写完代码后，告诉我那些代码被改动了
