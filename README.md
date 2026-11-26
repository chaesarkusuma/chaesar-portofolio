# CHAESAR — Multilingual Intro Experience

A standalone, cinematic loading screen built for a developer portfolio. Eleven
greetings cycle through a large centered word while a synchronized progress
bar counts up from 0–100%, followed by a brief pause and a smooth fade to
your real content.

## Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL — the intro plays once, then the preview shell
shows a placeholder message where your portfolio will live.

## Project structure

```
src/
  components/
    IntroLoader.jsx        # the reusable intro — this is what you integrate
    GreetingAnimation.jsx   # the centered word, per-script font handling
    ProgressBar.jsx         # thin progress indicator + percentage
    IdentityText.jsx        # name / role block below the greeting
    BackgroundEffects.jsx   # ambient light, grid, grain
  hooks/
    useIntroSequence.js     # single clock driving greetings + progress
  styles/
    globals.css
  App.jsx                   # standalone preview wrapper (for `npm run dev`)
  main.jsx
```

## Integrating into your main site

`IntroLoader` is self-contained and takes one prop: `onFinish`. Render it
above your real page content and swap views when it calls back:

```jsx
import { useState } from 'react'
import IntroLoader from './components/IntroLoader.jsx'

function Site() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <>
      <main aria-hidden={!introDone}>{/* your portfolio */}</main>
      <IntroLoader onFinish={() => setIntroDone(true)} />
    </>
  )
}
```

`IntroLoader` stays mounted until its own fade-out finishes, so keep it
rendered alongside your page rather than conditionally removing it the
instant `onFinish` fires — that would skip the exit transition.

### Bringing it into Google Antigravity / another codebase

1. Copy the four files in `src/components/` plus `src/hooks/useIntroSequence.js`.
2. Copy the `ink` / `paper` / `dim` / `muted` color tokens and the `display`
   / `sans` font families from `tailwind.config.js` into your project's
   Tailwind config (or inline the hex values if you're not on Tailwind).
3. Copy the `.chaesar-grid` and `.chaesar-grain` rules from
   `src/styles/globals.css`.
4. Make sure `framer-motion` is installed (`npm install framer-motion`).
5. Load the Google Fonts `<link>` tags from `index.html` in your app's
   `<head>` (Fraunces, Inter, Noto Sans JP/KR/SC, Noto Naskh Arabic).

## Customizing

- **Greetings / timing** — edit the `GREETINGS` array and `STEP_MS` /
  `HOLD_MS` constants in `src/hooks/useIntroSequence.js`.
- **Name and footer copy** — edit `IdentityText.jsx` and the footer string
  in `IntroLoader.jsx`.
- **Color palette** — all colors are tokens in `tailwind.config.js`
  (`ink`, `paper`, `dim`, `muted`); nothing is hardcoded in components.

## Accessibility

- Respects `prefers-reduced-motion`: animations shorten and simplify rather
  than disappear, so the intro still communicates progress.
- The progress bar is exposed as `role="progressbar"` with live value
  attributes.
- No horizontal overflow at any viewport width; layout is tested down to
  320px.
