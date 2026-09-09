export function DiscussionScreen({ players, roundNumber, onStartVoting }) {
  const activePlayers = players.filter((player) => !player.isEliminated)

  return (
    <div className="animate-enter mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col px-5 pb-8 pt-4">
      <header className="text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Round {roundNumber}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Discussion</h1>
      </header>

      <div className="mt-6 rounded-2xl border border-line bg-ink-raised/60 p-5 text-sm leading-relaxed text-paper-dim">
        <p>
          Take turns giving <strong className="text-paper">one clue</strong> about your word.
        </p>
        <p className="mt-2">Don&rsquo;t say your word directly.</p>
        <p className="mt-2">
          Listen carefully — the Imposter is trying to blend in.
        </p>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-sm uppercase tracking-[0.2em] text-paper-faint">
          Turn order
        </h2>
        <ol className="flex flex-col gap-2">
          {activePlayers.map((player, index) => (
            <li
              key={player.id}
              className="flex items-center gap-3 rounded-lg border border-line bg-ink-raised/40 px-3.5 py-2.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-elevated font-display text-xs text-paper-dim">
                {index + 1}
              </span>
              <span className="font-medium text-paper">{player.name}</span>
            </li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={onStartVoting}
        className="mt-auto w-full rounded-xl bg-accent py-3.5 font-display text-lg font-semibold text-ink shadow-card transition-transform active:scale-[0.98]"
      >
        Ready to vote
      </button>
    </div>
  )
}
