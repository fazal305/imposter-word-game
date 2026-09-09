import { useState } from 'react'
import { HoldToReveal } from './HoldToReveal'
import { ROLES } from '../utils/gameLogic'

export function RoleRevealScreen({ player, secret, index, total, onContinue }) {
  const [hasRevealed, setHasRevealed] = useState(false)
  const isImposter = secret.role === ROLES.IMPOSTER

  return (
    <div className="animate-enter mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col items-center px-5 pb-8 pt-4 text-center">
      <p className="font-display text-xs uppercase tracking-[0.3em] text-paper-faint">
        Player {index + 1} of {total}
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-paper">
        Pass the phone to
        <br />
        <span className="text-accent-strong">{player.name}</span>
      </h1>
      <p className="mt-2 max-w-xs text-sm text-paper-dim">
        Make sure nobody else can see your screen.
      </p>

      <div className="mt-8 w-full max-w-xs">
        <HoldToReveal
          accentClass={isImposter ? 'border-imposter' : 'border-agent'}
          onFirstReveal={() => setHasRevealed(true)}
        >
          <p className="font-display text-xs uppercase tracking-[0.25em] text-paper-faint">
            Your role
          </p>
          <p
            className={`font-display text-2xl font-bold tracking-wide ${
              isImposter ? 'text-imposter' : 'text-agent'
            }`}
          >
            {isImposter ? 'Imposter' : 'Secret Agent'}
          </p>

          {isImposter && secret.word === null ? (
            <>
              <p className="mt-4 font-display text-xs uppercase tracking-[0.25em] text-paper-faint">
                You have no word
              </p>
              <p className="mt-1 text-sm italic text-paper-dim">Blend in.</p>
            </>
          ) : (
            <>
              <p className="mt-4 font-display text-xs uppercase tracking-[0.25em] text-paper-faint">
                Your word
              </p>
              <p className="mt-1 break-words font-display text-3xl font-bold text-paper">
                {secret.word}
              </p>
            </>
          )}
        </HoldToReveal>
      </div>

      <p className="mt-4 text-xs text-paper-faint">Hold to reveal · release to hide</p>

      <button
        type="button"
        onClick={onContinue}
        disabled={!hasRevealed}
        className="mt-auto w-full max-w-xs rounded-xl bg-accent py-3.5 font-display text-lg font-semibold text-ink shadow-card transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30"
      >
        {index + 1 === total ? "I'm ready — start discussion" : "I've got it, next player"}
      </button>
    </div>
  )
}
