---
paths:
  - "src/components/**"
  - "src/pages/**"
  - "src/routes/**"
  - "src/store/**"
  - "src/styles/**"
  - "src/{App,main,entry-server}.tsx"
  - "src/lib/{mapMode,navOverflow,useHydrated,lazyWithPreload,useOpenEntityRef,search}.{ts,tsx}"
  - "tailwind.config.js"
  - "scripts/{smoke,a11y-audit,a11y-contrast}.{ts,mjs}"
---

# Frontend — constraints

How it works (decisions, measurements): `docs/ARCHITECTURE.md` › Frontend. Visible text: `i18n.md`. Map canvas: `maps.md`.

- **Reuse the primitives**, never hand-roll: `FilterChip` (`aria-pressed`), `FilterSection`, `FilterSearchField`,
  `ToggleRow` (`role="switch"`), `ActiveFilterBar` (`src/components/filters/`); `Modal` (docked by default, the map stays
  visible), `Drawer`, `Tabs` (WAI-ARIA tablist), `FloatingPanel` (disclosure); classes `.panel/.chip/.btn-*/.field/
  .count-badge/.active-chip`, tokens in `tailwind.config.js` (additive only).
- **Store contract**: one `activeModal` at a time; a new `ActiveModal` kind must be added to `ModalDeepLink.KINDS` +
  `entityExists` + `openModal`, or it silently closes. Filters (`FiltersDrawer`, which data) and layers
  (`LayersDrawer`, what is visible) stay separate and mutually exclusive in `useUiStore`. Result counts only through
  `selectVisibleLocations` / `useFilteredLocations`. The map mode is derived (`useMapMode`), never new state.
- **SSR/hydration**: zustand renders SSR *and* hydration from the store's INITIAL state. Stores set before the first
  render use `createSnapshotStore`; any other store read during the first render keeps an identical initial value
  on server and client or is gated by `useHydrated`. No `window`/`localStorage` during render.
- **Header (`TopNav`)**: one row, three zones (logo + `WorldSwitcher` | `WorldTabs` | utilities); every control `h-9`,
  vertically centred by flex, no offsets/transforms. Space adapts in CSS only (`worldTabsCss()` @container rules, no
  ResizeObserver/DOM measuring, SSR-identical); labels never truncated; active tab derived from the route
  (`activeWorldTabKey`). The anime selector is neutral (blue = active tab only). Choosing a world ALWAYS opens its
  Overview and resets the previous world's context; deep links are never redirected.
- **Map shell**: tools live in `ToolRail` (desktop rail below the zoom `<Controls>`, mobile bottom nav ≥ 44 px, `aria-pressed`);
  no "reset view" tool (fit-view exists). On mobile closed pills are hidden (`max-md:hidden`), one floating panel
  at a time (`onMobileToolClick`), footer hidden on `/map` (links in the ☰ menu); onboarding only after the cookie choice.
- **A11y (WCAG 2.2 AA)**: state is never colour-only; `Modal`/`Drawer` trap Tab, close on Esc, restore focus to the
  trigger, closed `Drawer` is `inert`; ⌘K search is a combobox (`aria-activedescendant`); graph views are
  `aria-hidden` with an accessible list. Targets ≥ 24×24 (pins).
- **Contrast (UX-01)**: informational text `ink-300` or lighter (`ink-400/500` only for icons next to a label,
  `aria-hidden` glyphs, `aria-disabled`); `ink-300` is not AA on `ink-600` or lighter; panels over the map use
  `bg-ink-900/90`, not `.panel`; white text only on `chakra-600`/`ember-600` or darker; dimmed pins dim only dot + icon.

Checks: `npx tsc -b` → `npm run build`; `npm run smoke` for any visible/interaction change (header: 5 routes × 6
viewports, modals, mobile, hydration kept); a11y: `npm run preview:static`, then `BASE=http://localhost:4173 npm run
audit:a11y` and `npm run audit:contrast` (each scenario declares the state it must reach).
