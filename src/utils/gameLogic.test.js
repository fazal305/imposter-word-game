import { describe, expect, it } from 'vitest'
import {
  ROLES,
  WINNERS,
  assignRoles,
  calculateVoteResult,
  createPlayers,
  hasEveryoneVoted,
  recordVote,
  startGame,
  startRematch,
} from './gameLogic'

const NAMES = ['Alex', 'Sara', 'Hamza', 'Ahmed']

describe('createPlayers', () => {
  it('creates one player per name with unique ids', () => {
    const players = createPlayers(NAMES)
    expect(players).toHaveLength(4)
    expect(new Set(players.map((p) => p.id)).size).toBe(4)
    expect(players.every((p) => p.isEliminated === false)).toBe(true)
  })
})

describe('assignRoles', () => {
  it('assigns exactly one Imposter and gives everyone else the Agent word', () => {
    const players = createPlayers(NAMES)
    const { roles, imposterId, agentWord, imposterWord } = assignRoles(players, {
      words: ['Coffee', 'Tea'],
    })

    const imposters = players.filter((p) => roles[p.id].role === ROLES.IMPOSTER)
    expect(imposters).toHaveLength(1)
    expect(imposters[0].id).toBe(imposterId)

    for (const player of players) {
      if (player.id === imposterId) {
        expect(roles[player.id].word).toBe(imposterWord)
      } else {
        expect(roles[player.id].role).toBe(ROLES.AGENT)
        expect(roles[player.id].word).toBe(agentWord)
      }
    }
    expect(agentWord).not.toBe(imposterWord)
  })

  it('gives the Imposter no word when noWordImposter is set', () => {
    const players = createPlayers(NAMES)
    const { roles, imposterId } = assignRoles(players, { words: ['Coffee', 'Tea'] }, {
      noWordImposter: true,
    })
    expect(roles[imposterId].word).toBeNull()
  })
})

describe('startGame', () => {
  it('produces a fully-formed ROLE_REVEAL state', () => {
    const state = startGame({ names: NAMES, settings: { categoryId: 'all', difficulty: 'all' } })
    expect(state.phase).toBe('ROLE_REVEAL')
    expect(state.players).toHaveLength(4)
    expect(Object.keys(state.roles)).toHaveLength(4)
    expect(state.currentRevealIndex).toBe(0)
    expect(state.votes).toEqual({})
  })
})

describe('startRematch', () => {
  it('keeps the same players but reassigns roles and resets round state', () => {
    const first = startGame({ names: NAMES, settings: { categoryId: 'all', difficulty: 'all' } })
    const rematch = startRematch({ ...first, votes: { x: 'y' }, eliminatedPlayerId: 'x' })

    expect(rematch.players.map((p) => p.name)).toEqual(first.players.map((p) => p.name))
    expect(rematch.votes).toEqual({})
    expect(rematch.eliminatedPlayerId).toBeNull()
    expect(rematch.roundNumber).toBe(first.roundNumber + 1)
  })
})

describe('recordVote / hasEveryoneVoted', () => {
  it('records votes without mutating the original map', () => {
    const votes = {}
    const next = recordVote(votes, 'p1', 'p2')
    expect(votes).toEqual({})
    expect(next).toEqual({ p1: 'p2' })
  })

  it('is only true once every player has voted', () => {
    const players = createPlayers(NAMES)
    let votes = {}
    for (const voter of players) {
      expect(hasEveryoneVoted(players, votes)).toBe(false)
      votes = recordVote(votes, voter.id, players[0].id)
    }
    expect(hasEveryoneVoted(players, votes)).toBe(true)
  })
})

describe('calculateVoteResult', () => {
  it('declares Agents the winner when the Imposter gets the most votes', () => {
    const players = createPlayers(NAMES)
    const [alex, sara, hamza, ahmed] = players
    const votes = { [alex.id]: sara.id, [hamza.id]: sara.id, [ahmed.id]: sara.id, [sara.id]: alex.id }

    const result = calculateVoteResult(players, votes, sara.id)
    expect(result.eliminatedPlayerId).toBe(sara.id)
    expect(result.imposterCaught).toBe(true)
    expect(result.winner).toBe(WINNERS.AGENTS)
  })

  it('declares the Imposter the winner when someone else is voted out', () => {
    const players = createPlayers(NAMES)
    const [alex, sara, hamza, ahmed] = players
    const votes = { [alex.id]: hamza.id, [sara.id]: hamza.id, [hamza.id]: alex.id, [ahmed.id]: hamza.id }

    const result = calculateVoteResult(players, votes, sara.id)
    expect(result.eliminatedPlayerId).toBe(hamza.id)
    expect(result.imposterCaught).toBe(false)
    expect(result.winner).toBe(WINNERS.IMPOSTER)
  })

  it('treats a tie as no elimination, favoring the Imposter', () => {
    const players = createPlayers(NAMES)
    const [alex, sara, hamza, ahmed] = players
    const votes = { [alex.id]: sara.id, [sara.id]: alex.id, [hamza.id]: alex.id, [ahmed.id]: sara.id }

    const result = calculateVoteResult(players, votes, sara.id)
    expect(result.isTie).toBe(true)
    expect(result.eliminatedPlayerId).toBeNull()
    expect(result.winner).toBe(WINNERS.IMPOSTER)
  })
})
