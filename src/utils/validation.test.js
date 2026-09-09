import { describe, expect, it } from 'vitest'
import { canStartGame, validatePlayerName } from './validation'

const players = [
  { id: '1', name: 'Alex' },
  { id: '2', name: 'Sara' },
]

describe('validatePlayerName', () => {
  it('rejects empty names', () => {
    expect(validatePlayerName('   ', players, '1')).toMatch(/empty/i)
  })

  it('rejects names over the length limit', () => {
    expect(validatePlayerName('a'.repeat(30), players, '1')).toMatch(/characters/i)
  })

  it('rejects duplicate names, case-insensitively', () => {
    expect(validatePlayerName('sara', players, '1')).toMatch(/taken/i)
  })

  it('allows a player to keep their own name', () => {
    expect(validatePlayerName('Sara', players, '2')).toBeNull()
  })

  it('accepts a valid new name', () => {
    expect(validatePlayerName('Hamza', players, '1')).toBeNull()
  })
})

describe('canStartGame', () => {
  it('requires at least the minimum player count', () => {
    expect(canStartGame([{ id: '1', name: 'A' }, { id: '2', name: 'B' }])).toBe(false)
  })

  it('rejects when any name is empty', () => {
    expect(
      canStartGame([
        { id: '1', name: 'A' },
        { id: '2', name: '' },
        { id: '3', name: 'C' },
      ])
    ).toBe(false)
  })

  it('rejects duplicate names', () => {
    expect(
      canStartGame([
        { id: '1', name: 'A' },
        { id: '2', name: 'a' },
        { id: '3', name: 'C' },
      ])
    ).toBe(false)
  })

  it('allows a valid roster', () => {
    expect(
      canStartGame([
        { id: '1', name: 'A' },
        { id: '2', name: 'B' },
        { id: '3', name: 'C' },
      ])
    ).toBe(true)
  })
})
