import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GameOverScreen } from './GameOverScreen'
import { ROLES, WINNERS } from '../utils/gameLogic'

const players = [
  { id: 'p1', name: 'Alex' },
  { id: 'p2', name: 'Sara' },
  { id: 'p3', name: 'Hamza' },
]

const roles = {
  p1: { role: ROLES.AGENT, word: 'Coffee' },
  p2: { role: ROLES.IMPOSTER, word: 'Tea' },
  p3: { role: ROLES.AGENT, word: 'Coffee' },
}

describe('GameOverScreen', () => {
  it('reveals every player role and both words', () => {
    render(
      <GameOverScreen
        players={players}
        roles={roles}
        imposterId="p2"
        agentWord="Coffee"
        imposterWord="Tea"
        winner={WINNERS.AGENTS}
        onPlayAgain={vi.fn()}
        onNewGame={vi.fn()}
      />
    )

    expect(screen.getAllByText('Sara').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('Imposter').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Secret Agent')).toHaveLength(2)
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('Tea')).toBeInTheDocument()
    expect(screen.getByText('Agents Win')).toBeInTheDocument()
  })

  it('shows "no word" when the Imposter had no word', () => {
    render(
      <GameOverScreen
        players={players}
        roles={roles}
        imposterId="p2"
        agentWord="Coffee"
        imposterWord={null}
        winner={WINNERS.IMPOSTER}
        onPlayAgain={vi.fn()}
        onNewGame={vi.fn()}
      />
    )
    expect(screen.getByText('no word')).toBeInTheDocument()
    expect(screen.getByText('Imposter Wins')).toBeInTheDocument()
  })

  it('wires up Play Again and New Game actions', () => {
    const onPlayAgain = vi.fn()
    const onNewGame = vi.fn()
    render(
      <GameOverScreen
        players={players}
        roles={roles}
        imposterId="p2"
        agentWord="Coffee"
        imposterWord="Tea"
        winner={WINNERS.AGENTS}
        onPlayAgain={onPlayAgain}
        onNewGame={onNewGame}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(onPlayAgain).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole('button', { name: /new game/i }))
    expect(onNewGame).toHaveBeenCalledOnce()
  })
})
