export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 12
export const MAX_NAME_LENGTH = 18

export function normalizeName(name) {
  return name.trim().replace(/\s+/g, ' ')
}

/**
 * Validates a single player name against the full roster (excluding the
 * player being edited, identified by `ownerId`). Returns an error string,
 * or null when the name is valid.
 */
export function validatePlayerName(name, players, ownerId) {
  const normalized = normalizeName(name)

  if (normalized.length === 0) return 'Name can’t be empty.'
  if (normalized.length > MAX_NAME_LENGTH) return `Keep names under ${MAX_NAME_LENGTH} characters.`

  const duplicate = players.some(
    (player) => player.id !== ownerId && player.name.toLowerCase() === normalized.toLowerCase()
  )
  if (duplicate) return 'That name is already taken.'

  return null
}

export function canAddPlayer(players) {
  return players.length < MAX_PLAYERS
}

export function canRemovePlayer(players) {
  return players.length > MIN_PLAYERS
}

export function canStartGame(players) {
  if (players.length < MIN_PLAYERS) return false
  const names = players.map((player) => normalizeName(player.name).toLowerCase())
  if (names.some((name) => name.length === 0)) return false
  return new Set(names).size === names.length
}
