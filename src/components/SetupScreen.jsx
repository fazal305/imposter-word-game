import { useMemo, useState } from 'react'
import { PlayerRow } from './PlayerRow'
import { CATEGORIES, DIFFICULTIES } from '../data/wordPairs'
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  canAddPlayer,
  canRemovePlayer,
  canStartGame,
  normalizeName,
  validatePlayerName,
} from '../utils/validation'

let idCounter = 0
const nextId = () => `draft-${idCounter++}-${Math.random().toString(36).slice(2, 6)}`

function makeDefaultPlayers() {
  return [nextId(), nextId(), nextId()].map((id, index) => ({ id, name: `Player ${index + 1}` }))
}

export function SetupScreen({ onStart }) {
  const [players, setPlayers] = useState(makeDefaultPlayers)
  const [categoryId, setCategoryId] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [noWordImposter, setNoWordImposter] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const errors = useMemo(() => {
    const map = {}
    for (const player of players) {
      const error = validatePlayerName(player.name, players, player.id)
      if (error) map[player.id] = error
    }
    return map
  }, [players])

  const hasErrors = Object.keys(errors).length > 0
  const readyToStart = canStartGame(players) && !hasErrors

  function addPlayer() {
    if (!canAddPlayer(players)) return
    setPlayers((prev) => [...prev, { id: nextId(), name: `Player ${prev.length + 1}` }])
  }

  function removePlayer(id) {
    if (!canRemovePlayer(players)) return
    setPlayers((prev) => prev.filter((player) => player.id !== id))
  }

  function renamePlayer(id, name) {
    setPlayers((prev) => prev.map((player) => (player.id === id ? { ...player, name } : player)))
  }

  function handleStart() {
    if (!readyToStart) return
    const names = players.map((player) => normalizeName(player.name))
    onStart(names, { categoryId, difficulty, noWordImposter })
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-10 sm:pt-14">
      <header className="mb-8 text-center">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-accent">Pass &amp; Play</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-paper">Imposter</h1>
        <p className="mt-2 text-sm text-paper-dim">
          Everyone gets a word. One of you doesn&rsquo;t. Find them before they blend in.
        </p>
      </header>

      <section aria-labelledby="players-heading" className="mb-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="players-heading" className="font-display text-lg font-semibold text-paper">
            Players
          </h2>
          <span className="text-sm text-paper-faint">
            {players.length} / {MAX_PLAYERS}
          </span>
        </div>

        <ul className="flex flex-col gap-2">
          {players.map((player, index) => (
            <PlayerRow
              key={player.id}
              player={player}
              index={index}
              error={errors[player.id]}
              onRename={renamePlayer}
              onRemove={removePlayer}
              canRemove={canRemovePlayer(players)}
            />
          ))}
        </ul>

        <button
          type="button"
          onClick={addPlayer}
          disabled={!canAddPlayer(players)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong py-2.5 text-sm font-medium text-paper-dim transition-colors hover:border-accent/60 hover:text-accent disabled:pointer-events-none disabled:opacity-40"
        >
          <span aria-hidden="true">+</span> Add player
        </button>
        <p className="mt-2 text-xs text-paper-faint">Need at least {MIN_PLAYERS} players to start.</p>
      </section>

      <section aria-labelledby="category-heading" className="mb-6">
        <h2 id="category-heading" className="mb-3 font-display text-lg font-semibold text-paper">
          Category
        </h2>
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', label: 'All Categories' }, ...CATEGORIES].map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              aria-pressed={categoryId === category.id}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                categoryId === category.id
                  ? 'border-accent bg-accent/15 text-accent-strong'
                  : 'border-line text-paper-dim hover:border-line-strong'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="difficulty-heading" className="mb-6">
        <h2 id="difficulty-heading" className="mb-3 font-display text-lg font-semibold text-paper">
          Difficulty
        </h2>
        <div className="flex gap-2">
          {[{ id: 'all', label: 'Any' }, ...DIFFICULTIES.map((d) => ({ id: d, label: capitalize(d) }))].map(
            (option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDifficulty(option.id)}
                aria-pressed={difficulty === option.id}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-colors ${
                  difficulty === option.id
                    ? 'border-accent bg-accent/15 text-accent-strong'
                    : 'border-line text-paper-dim hover:border-line-strong'
                }`}
              >
                {option.label}
              </button>
            )
          )}
        </div>
      </section>

      <section className="mb-8">
        <label className="flex items-center justify-between gap-3 rounded-lg border border-line bg-ink-raised/60 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-paper">No-word Imposter</span>
            <span className="block text-xs text-paper-faint">The Imposter gets no word at all — just bluffs.</span>
          </span>
          <input
            type="checkbox"
            checked={noWordImposter}
            onChange={(event) => setNoWordImposter(event.target.checked)}
            className="h-5 w-9 shrink-0 accent-accent"
          />
        </label>
      </section>

      <div className="mt-auto flex flex-col gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={!readyToStart}
          className="w-full rounded-xl bg-accent py-3.5 text-center font-display text-lg font-semibold text-ink shadow-card transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          Start Game
        </button>
        <button
          type="button"
          onClick={() => setShowRules(true)}
          className="text-sm font-medium text-paper-faint underline decoration-line underline-offset-4 hover:text-paper-dim"
        >
          How to play
        </button>
      </div>

      {showRules && <RulesSheet onClose={() => setShowRules(false)} />}
    </div>
  )
}

function RulesSheet({ onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl border border-line bg-ink-elevated p-6 shadow-card sm:rounded-2xl"
      >
        <h2 id="rules-title" className="mb-4 font-display text-xl font-semibold text-paper">
          How to Play
        </h2>
        <ol className="mb-6 flex flex-col gap-3 text-sm text-paper-dim">
          <li><strong className="text-paper">1. Get your word.</strong> Pass the phone around — everyone secretly views their word.</li>
          <li><strong className="text-paper">2. One is different.</strong> The Imposter gets a related but different word.</li>
          <li><strong className="text-paper">3. Give one clue.</strong> Take turns saying a single word about your word — don&rsquo;t say it directly.</li>
          <li><strong className="text-paper">4. Discuss.</strong> Listen for anyone whose clue feels off.</li>
          <li><strong className="text-paper">5. Vote.</strong> Everyone privately votes for who they suspect.</li>
          <li><strong className="text-paper">6. Catch them.</strong> Vote out the Imposter to win as a group.</li>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-accent py-3 text-center font-display font-semibold text-ink"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
