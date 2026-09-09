import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { VoteResultsScreen } from './VoteResultsScreen'
import { WINNERS } from '../utils/gameLogic'

const players = [
  { id: 'p1', name: 'Alex' },
  { id: 'p2', name: 'Sara' },
  { id: 'p3', name: 'Hamza' },
]

describe('VoteResultsScreen', () => {
  it('declares Agents the winner when the eliminated player was the Imposter', () => {
    const voteResult = {
      tally: [
        { playerId: 'p2', name: 'Sara', votes: 2 },
        { playerId: 'p1', name: 'Alex', votes: 1 },
        { playerId: 'p3', name: 'Hamza', votes: 0 },
      ],
      isTie: false,
      eliminatedPlayerId: 'p2',
      imposterCaught: true,
      winner: WINNERS.AGENTS,
    }
    render(<VoteResultsScreen players={players} voteResult={voteResult} onContinue={vi.fn()} />)
    expect(screen.getByText('Agents Win')).toBeInTheDocument()
    expect(screen.getByText(/was.*the Imposter/i)).toBeInTheDocument()
  })

  it('declares the Imposter the winner when someone else was eliminated', () => {
    const voteResult = {
      tally: [
        { playerId: 'p1', name: 'Alex', votes: 2 },
        { playerId: 'p2', name: 'Sara', votes: 1 },
        { playerId: 'p3', name: 'Hamza', votes: 0 },
      ],
      isTie: false,
      eliminatedPlayerId: 'p1',
      imposterCaught: false,
      winner: WINNERS.IMPOSTER,
    }
    render(<VoteResultsScreen players={players} voteResult={voteResult} onContinue={vi.fn()} />)
    expect(screen.getByText('Imposter Wins')).toBeInTheDocument()
  })

  it('shows a tie message with no elimination', () => {
    const voteResult = {
      tally: [
        { playerId: 'p1', name: 'Alex', votes: 1 },
        { playerId: 'p2', name: 'Sara', votes: 1 },
        { playerId: 'p3', name: 'Hamza', votes: 0 },
      ],
      isTie: true,
      eliminatedPlayerId: null,
      imposterCaught: false,
      winner: WINNERS.IMPOSTER,
    }
    render(<VoteResultsScreen players={players} voteResult={voteResult} onContinue={vi.fn()} />)
    expect(screen.getByText(/tie/i)).toBeInTheDocument()
  })
})
