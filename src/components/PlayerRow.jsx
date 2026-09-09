export function PlayerRow({ player, index, error, onRename, onRemove, canRemove }) {
  return (
    <li className="group">
      <div
        className={`flex items-center gap-2 rounded-lg border bg-ink-raised/60 py-1.5 pl-3 pr-1.5 transition-colors ${
          error ? 'border-imposter/70' : 'border-line focus-within:border-accent/70'
        }`}
      >
        <span className="w-6 shrink-0 text-center font-display text-sm text-paper-faint">
          {index + 1}
        </span>
        <input
          type="text"
          value={player.name}
          onChange={(event) => onRename(player.id, event.target.value)}
          placeholder={`Player ${index + 1}`}
          maxLength={24}
          aria-label={`Player ${index + 1} name`}
          aria-invalid={Boolean(error)}
          className="min-w-0 flex-1 bg-transparent text-base font-medium text-paper placeholder:text-paper-faint focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onRemove(player.id)}
          disabled={!canRemove}
          aria-label={`Remove ${player.name || `player ${index + 1}`}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-paper-faint transition-colors hover:bg-ink-elevated hover:text-danger disabled:pointer-events-none disabled:opacity-0"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {error && <p className="mt-1 pl-1 text-xs text-imposter">{error}</p>}
    </li>
  )
}
