# Imposter — The Word Game

A local, pass-and-play social deduction game for 3–12 players on one phone
or tablet. Everyone gets a secret word — except the Imposter, who gets a
different (but related) one. Give clues, vote, and catch them.

## Overview

Imposter is built for a group sharing a single device. Each player takes a
turn holding the phone privately to see their word, gives a one-word clue
out loud, and then the group votes — also privately, one phone-pass at a
time — on who they think the Imposter is.

## Features

- 3–12 players, with live validation for duplicate, empty, or overlong names
- 12 word categories (Food, Animals, Technology, Sports, and more) with
  easy/medium/hard difficulty filtering
- Optional "no-word Imposter" mode, where the Imposter has to bluff blind
- Secure press-and-hold reveal built on Pointer Events (mouse, touch, pen)
  with a Space/Enter keyboard fallback — nothing sensitive touches the DOM
  outside of an active hold
- Real private voting: a "pass the phone" handoff per voter, no running
  tally shown until every vote is in, and no self-voting
- Full final reveal with every role, both words, and the win condition
- One-tap rematch that keeps players and settings but reshuffles roles

## How It Works

1. Add players and pick a category on the setup screen.
2. Pass the phone around for each player to privately reveal their word.
3. Everyone gives one clue out loud, in turn.
4. Pass the phone around again for a private vote.
5. See the results, the full reveal, and the winner.

See [`docs/game-rules.md`](docs/game-rules.md) for the exact rules,
including how ties and the no-word Imposter mode are handled.

## Tech Stack

- [React](https://react.dev/) 19 + [Vite](https://vitejs.dev/) — plain
  JavaScript (JSX), no TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 4, via `@tailwindcss/vite`, with a
  small set of design tokens (`src/index.css`) instead of scattered
  arbitrary values
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- No backend, no external APIs, no network requests — the game runs
  entirely client-side and works offline once loaded

## Project Structure

```
src/
├── components/       # One component per screen, plus shared UI pieces
├── data/
│   └── wordPairs.js  # Curated word-pair database, organized by category
├── hooks/
│   ├── useGame.js         # Game state machine (reducer + actions)
│   └── useHoldToReveal.js # Press-and-hold interaction (Pointer Events + keyboard)
├── utils/
│   ├── gameLogic.js  # Pure game rules: roles, voting, winner calculation
│   ├── random.js
│   └── validation.js # Setup-screen validation rules
└── App.jsx           # Maps game phase -> screen component
```

See [`docs/architecture.md`](docs/architecture.md) for how the state machine,
privacy handling, and voting model fit together, and why they're built the
way they are.

## Getting Started

Requires Node.js 18+.

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

Opens a dev server (default `http://localhost:5173`) with hot reload.

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Testing

```bash
npm test    # run the full test suite once
npm run lint
```

The suite covers role assignment, vote tallying (including ties), winner
determination, setup validation, and the reveal/voting UI's privacy
behavior (e.g. a secret never renders outside an active hold, no vote is
shown until everyone has voted).

## Accessibility

- The press-and-hold reveal has a full keyboard equivalent: focus the card
  and hold Space or Enter.
- The rules dialog traps focus while open, closes on Escape, and returns
  focus to the button that opened it.
- Touch targets are sized to at least 44×44px.
- Color tokens are chosen to clear 4.5:1 contrast at the sizes they're
  actually used at (verified by computing WCAG contrast ratios, not just
  checking by eye).
- Animations are skipped under `prefers-reduced-motion`.

## Privacy

- No player's word is ever rendered to the DOM except during that player's
  own active hold on the reveal card.
- No vote is shown to anyone — including the voter's own previous choice —
  until every player has voted, at which point the full tally is revealed
  to the whole group at once (by design; this is a shared-device game).
- Nothing about game state is persisted to `localStorage` or sent over the
  network. Closing the tab clears everything.

## Design Decisions

- **Single round per game.** Win condition is a straight plurality vote; a
  tie means no one is eliminated and the Imposter wins by default. This
  keeps the rules unambiguous for a first release. See
  [`docs/game-rules.md`](docs/game-rules.md).
- **No chat/clue capture.** Clues are spoken out loud; the app only shows
  whose turn it is. Building a fake "clue log" that doesn't actually
  capture speech would be misleading.
- **No external word/dictionary API.** A curated local word-pair list is
  more reliable (no latency, no CORS, no rate limits, works offline) and
  the actual design work — pairs that are related but not a giveaway — has
  to be curated either way.

## Future Roadmap

- Multi-round elimination chains
- Online multiplayer (the game-logic layer was written to make this a
  reducer-swap, not a rewrite — see `docs/architecture.md`)
- Custom word packs / user-submitted categories
- Optional sound effects (muted by default, with a mute control)

## Known Limitations

- Local pass-and-play only; there is no online/remote multiplayer yet.
- No persistence — refreshing mid-game loses the round.
- Word database is curated by hand rather than pulled from an external
  source, so it won't grow on its own.

## License

[MIT](LICENSE)
