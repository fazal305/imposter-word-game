import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SetupScreen } from './SetupScreen'
import { MAX_PLAYERS } from '../utils/validation'

describe('SetupScreen', () => {
  it('starts with 3 default players and Start Game enabled', () => {
    render(<SetupScreen onStart={vi.fn()} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(3)
    expect(screen.getByRole('button', { name: /start game/i })).toBeEnabled()
  })

  it('blocks starting on a duplicate name', () => {
    render(<SetupScreen onStart={vi.fn()} />)
    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[1], { target: { value: 'Player 1' } })
    expect(screen.getAllByText(/already taken/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /start game/i })).toBeDisabled()
  })

  it('blocks starting on an empty name', () => {
    render(<SetupScreen onStart={vi.fn()} />)
    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '   ' } })
    expect(screen.getByText(/empty/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start game/i })).toBeDisabled()
  })

  it('caps the roster at the configured maximum', () => {
    render(<SetupScreen onStart={vi.fn()} />)
    const addButton = screen.getByRole('button', { name: /add player/i })
    for (let i = 0; i < MAX_PLAYERS + 5; i++) fireEvent.click(addButton)
    expect(screen.getAllByRole('textbox')).toHaveLength(MAX_PLAYERS)
    expect(addButton).toBeDisabled()
  })

  it('passes trimmed names and settings to onStart', () => {
    const onStart = vi.fn()
    render(<SetupScreen onStart={onStart} />)
    fireEvent.click(screen.getByRole('button', { name: /start game/i }))
    expect(onStart).toHaveBeenCalledWith(
      ['Player 1', 'Player 2', 'Player 3'],
      { categoryId: 'all', difficulty: 'all', noWordImposter: false }
    )
  })

  it('opens the rules dialog with focus trapped inside, and Escape returns focus to the trigger', () => {
    render(<SetupScreen onStart={vi.fn()} />)
    const trigger = screen.getByRole('button', { name: /how to play/i })
    fireEvent.click(trigger)

    const dialog = screen.getByRole('dialog')
    const closeButton = screen.getByRole('button', { name: /got it/i })
    expect(closeButton).toHaveFocus()

    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(closeButton).toHaveFocus()

    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
