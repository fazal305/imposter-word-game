import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { VotingScreen } from './VotingScreen'

const players = [
  { id: 'p1', name: 'Alex', isEliminated: false },
  { id: 'p2', name: 'Sara', isEliminated: false },
  { id: 'p3', name: 'Hamza', isEliminated: false },
]

describe('VotingScreen', () => {
  it('shows a private handoff screen naming the current voter before the ballot', () => {
    render(<VotingScreen players={players} currentVoterIndex={0} onCastVote={vi.fn()} />)
    expect(screen.getByText(/pass the phone to/i)).toBeInTheDocument()
    expect(screen.getByText('Alex')).toBeInTheDocument()
    expect(screen.queryByText('Sara')).not.toBeInTheDocument()
  })

  it('does not let a voter select themself as a suspect', () => {
    render(<VotingScreen players={players} currentVoterIndex={0} onCastVote={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /let.s vote/i }))
    expect(screen.queryByRole('radio', { name: /alex/i })).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /sara/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /hamza/i })).toBeInTheDocument()
  })

  it('requires a selection before confirming, then records the vote', () => {
    const onCastVote = vi.fn()
    render(<VotingScreen players={players} currentVoterIndex={0} onCastVote={onCastVote} />)
    fireEvent.click(screen.getByRole('button', { name: /let.s vote/i }))

    const confirmButton = screen.getByRole('button', { name: /confirm vote/i })
    expect(confirmButton).toBeDisabled()

    fireEvent.click(screen.getByRole('radio', { name: /sara/i }))
    expect(confirmButton).toBeEnabled()

    fireEvent.click(confirmButton)
    expect(onCastVote).toHaveBeenCalledWith('p1', 'p2')
    expect(screen.getByText(/vote recorded/i)).toBeInTheDocument()
  })

  it('never displays who anyone voted for during the voting phase', () => {
    const onCastVote = vi.fn()
    render(<VotingScreen players={players} currentVoterIndex={0} onCastVote={onCastVote} />)
    fireEvent.click(screen.getByRole('button', { name: /let.s vote/i }))
    fireEvent.click(screen.getByRole('radio', { name: /sara/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirm vote/i }))

    expect(screen.queryByText(/sara/i)).not.toBeInTheDocument()
    expect(screen.getByText(/vote recorded/i)).toBeInTheDocument()
  })
})
