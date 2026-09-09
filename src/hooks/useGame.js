import { useCallback, useReducer } from 'react'
import {
  PHASES,
  calculateVoteResult,
  hasEveryoneVoted,
  recordVote,
  startGame as buildGame,
  startRematch,
} from '../utils/gameLogic'

export const DEFAULT_SETTINGS = Object.freeze({
  categoryId: 'all',
  difficulty: 'all',
  noWordImposter: false,
})

const initialState = {
  phase: PHASES.SETUP,
  players: [],
  roles: {},
  imposterId: null,
  agentWord: null,
  imposterWord: null,
  currentRevealIndex: 0,
  currentVoterIndex: 0,
  votes: {},
  eliminatedPlayerId: null,
  voteResult: null,
  winner: null,
  roundNumber: 0,
  settings: DEFAULT_SETTINGS,
  recentPairKeys: [],
  setupNames: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const next = buildGame({
        names: action.names,
        settings: action.settings,
        recentPairKeys: state.recentPairKeys,
      })
      return { ...next, setupNames: action.names }
    }

    case 'ADVANCE_REVEAL': {
      const nextIndex = state.currentRevealIndex + 1
      if (nextIndex >= state.players.length) {
        return { ...state, phase: PHASES.DISCUSSION }
      }
      return { ...state, currentRevealIndex: nextIndex }
    }

    case 'START_VOTING':
      return { ...state, phase: PHASES.VOTING, currentVoterIndex: 0, votes: {} }

    case 'CAST_VOTE': {
      const votes = recordVote(state.votes, action.voterId, action.suspectId)
      const nextVoterIndex = state.currentVoterIndex + 1
      const activePlayers = state.players.filter((p) => !p.isEliminated)

      if (hasEveryoneVoted(activePlayers, votes)) {
        const result = calculateVoteResult(activePlayers, votes, state.imposterId)
        return {
          ...state,
          votes,
          voteResult: result,
          winner: result.winner,
          eliminatedPlayerId: result.eliminatedPlayerId,
          phase: PHASES.VOTE_RESULT,
        }
      }

      return { ...state, votes, currentVoterIndex: nextVoterIndex }
    }

    case 'CONTINUE_TO_GAME_OVER':
      return { ...state, phase: PHASES.GAME_OVER }

    case 'PLAY_AGAIN':
      return startRematch(state)

    case 'NEW_GAME':
      return { ...initialState, recentPairKeys: state.recentPairKeys, setupNames: state.setupNames }

    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const startNewGame = useCallback(
    (names, settings) => dispatch({ type: 'START_GAME', names, settings }),
    []
  )
  const advanceReveal = useCallback(() => dispatch({ type: 'ADVANCE_REVEAL' }), [])
  const startVoting = useCallback(() => dispatch({ type: 'START_VOTING' }), [])
  const castVote = useCallback(
    (voterId, suspectId) => dispatch({ type: 'CAST_VOTE', voterId, suspectId }),
    []
  )
  const continueToGameOver = useCallback(() => dispatch({ type: 'CONTINUE_TO_GAME_OVER' }), [])
  const playAgain = useCallback(() => dispatch({ type: 'PLAY_AGAIN' }), [])
  const newGame = useCallback(() => dispatch({ type: 'NEW_GAME' }), [])

  return {
    state,
    actions: {
      startNewGame,
      advanceReveal,
      startVoting,
      castVote,
      continueToGameOver,
      playAgain,
      newGame,
    },
  }
}
