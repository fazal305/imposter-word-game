# Architecture

## Game state machine

All game state lives in one reducer, [`useGame`](../src/hooks/useGame.js), which
drives a single `phase` field through six states:

```
SETUP -> ROLE_REVEAL -> DISCUSSION -> VOTING -> VOTE_RESULT -> GAME_OVER
```

`App.jsx` renders one screen component per phase and passes it only the state
slice it needs. No screen component reads or mutates game state directly —
they call the action functions returned by `useGame` (`startNewGame`,
`advanceReveal`, `castVote`, `playAgain`, etc.), which dispatch to the
reducer. This keeps every game rule in one place ([`src/utils/gameLogic.js`](../src/utils/gameLogic.js))
and fully unit-testable without rendering any UI.

## Role assignment

`assignRoles` picks one player at random as the Imposter and gives everyone
else the same "Agent" word from a related word pair (`src/data/wordPairs.js`).
The Imposter gets the pair's other word, or no word at all in "no-word
Imposter" mode. The full role map (`{ [playerId]: { role, word } }`) is kept
in game state, but UI components only ever receive the one player's secret
relevant to the screen being rendered — see **Privacy** below.

## Voting

Votes are recorded as a simple `{ [voterId]: suspectId }` map. Nothing reads
this map until every active player has voted (`hasEveryoneVoted`), at which
point `calculateVoteResult` tallies it once. This shape was chosen
deliberately so the same reducer action (`CAST_VOTE`) could later be fed by
votes arriving over a network from different devices, instead of a single
local device cycling through voters — the tally and winner logic wouldn't
need to change at all.

## Privacy

Two screens handle information a specific player shouldn't see:

- **Role reveal**: `App.jsx` passes `RoleRevealScreen` only
  `state.roles[currentPlayer.id]` — never the full roles map. The secret
  itself only exists in the DOM while the `HoldToReveal` card is actively
  pressed or held via keyboard; it's removed immediately on release,
  pointer-cancel, or blur.
- **Voting**: `VotingScreen` never renders anyone's vote back to the screen.
  Each voter gets a "pass the phone" handoff before their own ballot, and
  after confirming a vote sees only "Vote recorded" — never a running tally.
  The full breakdown only appears on `VoteResultsScreen`, after voting ends.

## Extending to network multiplayer

The reducer and game-logic functions don't assume a single local device.
Concretely, moving to networked play would mean:

- Replacing local `dispatch` calls with actions sent to a host device or
  server, which runs the same `gameLogic.js` functions and broadcasts the
  resulting state.
- Replacing the pass-and-play handoff screens (`RoleRevealScreen`'s "pass the
  phone to X", `VotingScreen`'s handoff step) with each player simply seeing
  their own device's view of the current phase.
- Everything else — round setup, role assignment, vote tallying, winner
  calculation — is already UI-independent and would not need to change.
