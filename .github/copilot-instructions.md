## Repo snapshot

- Single-page static front-end demo. Key files:
  - `index.html` — entry HTML; includes `main.js` as an ES module
  - `main.js` — app logic: fetches `people.json`, renders list, wires `.search-field`
  - `people.json` — sample data used as the single data source
  - `style.css` — minimal styling

## Big picture / architecture

This is a tiny static site (no backend). The app reads `people.json` via a browser `fetch()` and renders content into the DOM. `main.js` is written as an ES module using top-level `await` and modern Array APIs (e.g. `toSorted`). There are no build steps or bundlers configured in `package.json`.

Data flow (high-level):
- Browser loads `index.html` -> `<script type="module" src="main.js">` executes
- `main.js` does `await fetch('people.json').then(res => res.json())`
- The `render(search)` function filters, sorts and maps `people` -> HTML and writes into `.people` element
- The search input `.search-field` calls `render()` on `keyup`

## Developer workflows (how to run & test locally)

- Because `main.js` uses `fetch('people.json')`, opening `index.html` via `file://` may fail in some browsers. Use a simple static server from the repo root.

  Recommended quick options (PowerShell examples):

  - If you have Python 3 installed:

    python -m http.server 8000

  - Or with npm (if you want):

    npx http-server -p 8000

  Then open http://localhost:8000 in a modern browser.

## Project-specific patterns & conventions (what to follow)

- Keep logic small and functional-style in `main.js`: prefer chains of array methods (.filter, .toSorted, .map, .join). Example pattern used in the file:

  people
    .filter(({ firstName }) => ...)
    .toSorted((a, b) => a.firstName > b.firstName ? 1 : -1)
    .map(({ firstName, lastName, email }) => `...`)

- Use destructuring in loops and callbacks (existing code uses `({ firstName, lastName, email })`).
- DOM selectors used in repo: `.search-field` and `.people`. Update them consistently if changing HTML structure.
- `main.js` uses top-level await and `type="module"` in `index.html` — preserve the module semantics if refactoring.

## Known quirks & gotchas

- No build/test/lint configuration in `package.json`. `package.json` contains only placeholder test script. There is no bundler; code must run in the browser as-is.
- `main.js` uses `Array.prototype.toSorted`, which is a recent addition — it may not work in older browsers. If broader compatibility is required, replace with `slice().sort(...)`.
- `people.json` contains realistic-looking sample data; some `birthDate` fields are future dates — that is test/sample data, not a validation bug.

## Typical tasks and examples for an AI coding assistant

- Adding a new field to people output (e.g., `phone`):
  1) Add property to `people.json` entries.
  2) Update `main.js` map step to destructure and render `phone`.
  3) Keep markup inside the `.person` (or `section.person`) structure to match `style.css`.

- Fixing browser-compatibility issues with `toSorted`:
  Replace `.toSorted((a,b)=>...)` with `.slice().sort((a,b)=>...)` to support older browsers.

- If you need tests or a build, create standard artifacts: `package.json` scripts, optionally a bundler (Vite/Parcel) and add an automated test runner. Currently none are present — update README and CI if you add them.

## Files to inspect when changing behavior

- `main.js` — primary logic and event wiring
- `people.json` — authoritative sample data for rendering
- `index.html` — module tag, input and placeholder structure
- `style.css` — small layout rules for `.person` and `.search-field`

If anything here is unclear or you'd like the file to follow a different convention (e.g., add a build step, add tests, or support older browsers), tell me which direction and I'll update this instruction file accordingly.
