import { ROLES, WINNERS } from '../utils/gameLogic'

export function GameOverScreen({
  players,
  roles,
  imposterId,
  agentWord,
  imposterWord,
  winner,
  onPlayAgain,
  onNewGame,
}) {
  const imposter = players.find((player) => player.id === imposterId)

  return (
    <div className="animate-enter mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col px-5 pb-8 pt-4 text-center">
      <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Game Over</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper">
        The Imposter was
        <br />
        <span className="text-imposter">{imposter?.name}</span>
      </h1>

      <div
        className={`mt-6 rounded-2xl border-2 py-6 ${
          winner === WINNERS.AGENTS ? 'border-agent bg-agent/10' : 'border-imposter bg-imposter/10'
        }`}
      >
        <p
          className={`font-display text-3xl font-bold ${
            winner === WINNERS.AGENTS ? 'text-agent' : 'text-imposter'
          }`}
        >
          {winner === WINNERS.AGENTS ? 'Agents Win' : 'Imposter Wins'}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-ink-raised/50 p-4">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-paper-faint">The words</p>
        <p className="mt-2 text-sm text-paper-dim">
          Agents: <span className="font-semibold text-paper">{agentWord}</span>
        </p>
        <p className="mt-1 text-sm text-paper-dim">
          Imposter:{' '}
          <span className="font-semibold text-paper">{imposterWord ?? 'no word'}</span>
        </p>
      </div>

      <ul className="mt-6 flex flex-col gap-2 text-left">
        {players.map((player) => {
          const isImposter = roles[player.id]?.role === ROLES.IMPOSTER
          return (
            <li
              key={player.id}
              className="flex items-center justify-between rounded-lg border border-line bg-ink-raised/40 px-4 py-3"
            >
              <span className="font-medium text-paper">{player.name}</span>
              <span
                className={`font-display text-xs font-semibold uppercase tracking-wide ${
                  isImposter ? 'text-imposter' : 'text-agent'
                }`}
              >
                {isImposter ? 'Imposter' : 'Secret Agent'}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full rounded-xl bg-accent py-3.5 font-display text-lg font-semibold text-ink shadow-card transition-transform active:scale-[0.98]"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onNewGame}
          className="w-full rounded-xl border border-line-strong py-3.5 font-display text-lg font-semibold text-paper transition-colors hover:border-accent/60"
        >
          New game
        </button>
      </div>
    </div>
  )
}
