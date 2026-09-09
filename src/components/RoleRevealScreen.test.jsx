import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RoleRevealScreen } from './RoleRevealScreen'
import { ROLES } from '../utils/gameLogic'

const player = { id: 'p1', name: 'Sara' }

function renderScreen(secret, props = {}) {
  return render(
    <RoleRevealScreen player={player} secret={secret} index={0} total={3} onContinue={vi.fn()} {...props} />
  )
}

describe('RoleRevealScreen', () => {
  it('does not render the secret word until the card is held', () => {
    renderScreen({ role: ROLES.AGENT, word: 'Coffee' })
    expect(screen.queryByText('Coffee')).not.toBeInTheDocument()
  })

  it('reveals the word while the card is pressed and hides it on release', () => {
    renderScreen({ role: ROLES.AGENT, word: 'Coffee' })
    const card = screen.getByRole('button', { name: /press and hold/i })

    fireEvent.pointerDown(card, { pointerId: 1 })
    expect(screen.getByText('Coffee')).toBeInTheDocument()

    fireEvent.pointerUp(card, { pointerId: 1 })
    expect(screen.queryByText('Coffee')).not.toBeInTheDocument()
  })

  it('hides the word on pointer cancel and pointer leave, not just pointer up', () => {
    renderScreen({ role: ROLES.IMPOSTER, word: 'Tea' })
    const card = screen.getByRole('button', { name: /press and hold/i })

    fireEvent.pointerDown(card, { pointerId: 1 })
    expect(screen.getByText('Tea')).toBeInTheDocument()
    fireEvent.pointerCancel(card, { pointerId: 1 })
    expect(screen.queryByText('Tea')).not.toBeInTheDocument()

    fireEvent.pointerDown(card, { pointerId: 1 })
    fireEvent.pointerLeave(card, { pointerId: 1 })
    expect(screen.queryByText('Tea')).not.toBeInTheDocument()
  })

  it('supports keyboard reveal with Space and Enter', () => {
    renderScreen({ role: ROLES.AGENT, word: 'Coffee' })
    const card = screen.getByRole('button', { name: /press and hold/i })

    fireEvent.keyDown(card, { key: ' ' })
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    fireEvent.keyUp(card, { key: ' ' })
    expect(screen.queryByText('Coffee')).not.toBeInTheDocument()
  })

  it('shows the no-word messaging for a wordless Imposter', () => {
    renderScreen({ role: ROLES.IMPOSTER, word: null })
    const card = screen.getByRole('button', { name: /press and hold/i })
    fireEvent.pointerDown(card, { pointerId: 1 })
    expect(screen.getByText(/you have no word/i)).toBeInTheDocument()
    expect(screen.getByText(/blend in/i)).toBeInTheDocument()
  })

  it('keeps the continue button disabled until the player has revealed at least once', () => {
    renderScreen({ role: ROLES.AGENT, word: 'Coffee' })
    const continueButton = screen.getByRole('button', { name: /next player/i })
    expect(continueButton).toBeDisabled()

    const card = screen.getByRole('button', { name: /press and hold/i })
    fireEvent.pointerDown(card, { pointerId: 1 })
    fireEvent.pointerUp(card, { pointerId: 1 })

    expect(continueButton).toBeEnabled()
  })
})
