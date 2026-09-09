import { getAvailablePairs } from '../data/wordPairs'
import { pickNonRepeatingPair, pairKey, randomIndex, shuffle } from './random'

export const PHASES = Object.freeze({
  SETUP: 'SETUP',
  ROLE_REVEAL: 'ROLE_REVEAL',
  DISCUSSION: 'DISCUSSION',
  VOTING: 'VOTING',
  VOTE_RESULT: 'VOTE_RESULT',
  GAME_OVER: 'GAME_OVER',
})

export const ROLES = Object.freeze({
  AGENT: 'AGENT',
  IMPOSTER: 'IMPOSTER',
})

export const WINNERS = Object.freeze({
  AGENTS: 'AGENTS',
  IMPOSTER: 'IMPOSTER',
})

const RECENT_PAIR_HISTORY = 5

/** Builds the public player roster from a list of trimmed, validated names. */
export function createPlayers(names) {
  return names.map((name, index) => ({
    id: `player-${index}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    isEliminated: false,
  }))
}

/** Picks a word pair, avoiding recent repeats where possible. */
export function selectWordPair({ categoryId, difficulty, recentKeys = [] }) {
  const pairs = getAvailablePairs({ categoryId, difficulty })
  const pool = pairs.length > 0 ? pairs : getAvailablePairs({})
  return pickNonRepeatingPair(pool, recentKeys)
}

/**
 * Assigns exactly one Imposter and builds a secret role map keyed by player
 * id. The map is kept separate from the public `players` array so UI code
 * must deliberately opt in to reading a specific player's secret rather
 * than having every role available wherever `players` is in scope.
 */
export function assignRoles(players, wordPair, { noWordImposter = false } = {}) {
  const [agentWord, imposterWord] = shuffle(wordPair.words)
  const imposterId = players[randomIndex(players.length)].id

  const roles = {}
  for (const player of players) {
    if (player.id === imposterId) {
      roles[player.id] = {
        role: ROLES.IMPOSTER,
        word: noWordImposter ? null : imposterWord,
      }
    } else {
      roles[player.id] = { role: ROLES.AGENT, word: agentWord }
    }
  }

  return { roles, imposterId, agentWord, imposterWord }
}

/** Builds a fresh game ready for ROLE_REVEAL, from setup-screen input. */
export function startGame({ names, settings, recentPairKeys = [] }) {
  const players = createPlayers(names)
  const wordPair = selectWordPair({
    categoryId: settings.categoryId,
    difficulty: settings.difficulty,
    recentKeys: recentPairKeys,
  })
  const { roles, imposterId, agentWord, imposterWord } = assignRoles(players, wordPair, settings)

  return {
    phase: PHASES.ROLE_REVEAL,
    players,
    roles,
    imposterId,
    agentWord,
    imposterWord,
    currentRevealIndex: 0,
    currentVoterIndex: 0,
    votes: {},
    eliminatedPlayerId: null,
    winner: null,
    roundNumber: 1,
    settings,
    recentPairKeys: [pairKey(wordPair), ...recentPairKeys].slice(0, RECENT_PAIR_HISTORY),
  }
}

/** Starts a new round with the same players/settings but a fresh word + Imposter. */
export function startRematch(state) {
  const wordPair = selectWordPair({
    categoryId: state.settings.categoryId,
    difficulty: state.settings.difficulty,
    recentKeys: state.recentPairKeys,
  })
  const { roles, imposterId, agentWord, imposterWord } = assignRoles(
    state.players,
    wordPair,
    state.settings
  )

  return {
    ...state,
    phase: PHASES.ROLE_REVEAL,
    players: state.players.map((player) => ({ ...player, isEliminated: false })),
    roles,
    imposterId,
    agentWord,
    imposterWord,
    currentRevealIndex: 0,
    currentVoterIndex: 0,
    votes: {},
    eliminatedPlayerId: null,
    winner: null,
    roundNumber: state.roundNumber + 1,
    recentPairKeys: [pairKey(wordPair), ...state.recentPairKeys].slice(0, RECENT_PAIR_HISTORY),
  }
}

export function recordVote(votes, voterId, suspectId) {
  return { ...votes, [voterId]: suspectId }
}

export function hasEveryoneVoted(players, votes) {
  return players.every((player) => Object.prototype.hasOwnProperty.call(votes, player.id))
}

/**
 * Tallies votes into a sorted breakdown plus the outcome. A tie for first
 * place means no single suspect commanded a majority voice, which the game
 * rules treat as "the group failed to agree" — the Imposter escapes.
 */
export function calculateVoteResult(players, votes, imposterId) {
  const counts = new Map(players.map((player) => [player.id, 0]))
  for (const suspectId of Object.values(votes)) {
    counts.set(suspectId, (counts.get(suspectId) ?? 0) + 1)
  }

  const tally = players
    .map((player) => ({ playerId: player.id, name: player.name, votes: counts.get(player.id) ?? 0 }))
    .sort((a, b) => b.votes - a.votes)

  const topCount = tally[0]?.votes ?? 0
  const topSuspects = tally.filter((entry) => entry.votes === topCount && topCount > 0)
  const isTie = topSuspects.length !== 1

  const eliminatedPlayerId = isTie ? null : topSuspects[0].playerId
  const imposterCaught = eliminatedPlayerId === imposterId
  const winner = imposterCaught ? WINNERS.AGENTS : WINNERS.IMPOSTER

  return { tally, isTie, eliminatedPlayerId, imposterCaught, winner }
}
