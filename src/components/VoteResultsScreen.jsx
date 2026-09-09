import { WINNERS } from '../utils/gameLogic'

export function VoteResultsScreen({ players, voteResult, onContinue }) {
  const { tally, isTie, eliminatedPlayerId, imposterCaught, winner } = voteResult
  const maxVotes = tally[0]?.votes ?? 0
  const eliminatedPlayer = players.find((player) => player.id === eliminatedPlayerId)

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col px-5 pb-8 pt-4 text-center">
      <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">The group has spoken</p>

      <ul className="mt-6 flex flex-col gap-2">
        {tally.map((entry) => (
          <li
            key={entry.playerId}
            className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
              entry.playerId === eliminatedPlayerId
                ? 'border-accent bg-accent/10'
                : 'border-line bg-ink-raised/40'
            }`}
          >
            <span className="font-medium text-paper">{entry.name}</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: maxVotes > 0 ? `${(entry.votes / maxVotes) * 100}%` : '0%' }}
                />
              </div>
              <span className="w-14 text-right text-sm text-paper-dim">
                {entry.votes} {entry.votes === 1 ? 'vote' : 'votes'}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {isTie ? (
          <p className="font-display text-xl font-semibold text-paper">
            It&rsquo;s a tie — nobody was voted out.
          </p>
        ) : (
          <p className="font-display text-xl font-semibold text-paper">
            <span className="text-accent-strong">{eliminatedPlayer?.name}</span> was
            {imposterCaught ? ' ' : ' not '}
            the Imposter
          </p>
        )}
      </div>

      <div
        className={`mt-6 rounded-2xl border-2 py-6 ${
          winner === WINNERS.AGENTS ? 'border-agent bg-agent/10' : 'border-imposter bg-imposter/10'
        }`}
      >
        <p className="font-display text-xs uppercase tracking-[0.25em] text-paper-faint">
          {winner === WINNERS.AGENTS ? 'The Imposter was caught' : 'The Imposter escaped'}
        </p>
        <p
          className={`mt-1 font-display text-3xl font-bold ${
            winner === WINNERS.AGENTS ? 'text-agent' : 'text-imposter'
          }`}
        >
          {winner === WINNERS.AGENTS ? 'Agents Win' : 'Imposter Wins'}
        </p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-auto w-full rounded-xl bg-accent py-3.5 font-display text-lg font-semibold text-ink shadow-card transition-transform active:scale-[0.98]"
      >
        See final reveal
      </button>
    </div>
  )
}
