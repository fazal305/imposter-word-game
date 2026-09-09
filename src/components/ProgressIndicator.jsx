import { PHASES } from '../utils/gameLogic'

const STEPS = [
  { phase: PHASES.ROLE_REVEAL, label: 'Reveal' },
  { phase: PHASES.DISCUSSION, label: 'Discuss' },
  { phase: PHASES.VOTING, label: 'Vote' },
  { phase: PHASES.VOTE_RESULT, label: 'Result' },
]

export function ProgressIndicator({ phase }) {
  const activeIndex = STEPS.findIndex((step) => step.phase === phase)
  if (activeIndex === -1) return null

  return (
    <ol className="flex items-center justify-center gap-2" aria-label="Game progress">
      {STEPS.map((step, index) => (
        <li key={step.phase} className="flex items-center gap-2">
          <span
            aria-current={index === activeIndex ? 'step' : undefined}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex
                ? 'w-6 bg-accent'
                : index < activeIndex
                  ? 'w-1.5 bg-accent/50'
                  : 'w-1.5 bg-line'
            }`}
          />
        </li>
      ))}
    </ol>
  )
}
