/** Returns a random integer in [0, max). */
export function randomIndex(max) {
  return Math.floor(Math.random() * max)
}

/** Returns a random element from a non-empty array. */
export function pickRandom(items) {
  return items[randomIndex(items.length)]
}

/**
 * Picks a random pair from `pairs`, avoiding any pair whose key appears in
 * `recentKeys` when a non-repeating alternative exists. Falls back to any
 * pair if every option was recently used (small word pools shouldn't lock up).
 */
export function pickNonRepeatingPair(pairs, recentKeys = []) {
  const fresh = pairs.filter((pair) => !recentKeys.includes(pairKey(pair)))
  const pool = fresh.length > 0 ? fresh : pairs
  return pickRandom(pool)
}

export function pairKey(pair) {
  return pair.words.join('::')
}

/** Fisher-Yates shuffle; does not mutate the input array. */
export function shuffle(items) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
