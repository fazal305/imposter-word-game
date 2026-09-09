import { useState } from 'react'

const STEPS = Object.freeze({ HANDOFF: 'handoff', BALLOT: 'ballot', RECORDED: 'recorded' })

export function VotingScreen({ players, currentVoterIndex, onCastVote }) {
  const [step, setStep] = useState(STEPS.HANDOFF)
  const [selectedSuspectId, setSelectedSuspectId] = useState(null)

  const activePlayers = players.filter((player) => !player.isEliminated)
  const voter = activePlayers[currentVoterIndex]
  const suspects = activePlayers.filter((player) => player.id !== voter.id)

  function handleReady() {
    setStep(STEPS.BALLOT)
  }

  function handleConfirm() {
    if (!selectedSuspectId) return
    onCastVote(voter.id, selectedSuspectId)
    setSelectedSuspectId(null)
    setStep(STEPS.RECORDED)
  }

  function handleContinue() {
    setStep(STEPS.HANDOFF)
  }

  if (step === STEPS.HANDOFF) {
    return (
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-paper-faint">
          Voter {currentVoterIndex + 1} of {activePlayers.length}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-paper">
          Pass the phone to
          <br />
          <span className="text-accent-strong">{voter.name}</span>
        </h1>
        <p className="mt-3 max-w-xs text-sm text-paper-dim">
          Your vote is private. Nobody else should see this screen.
        </p>
        <button
          type="button"
          onClick={handleReady}
          className="mt-10 w-full max-w-xs rounded-xl bg-accent py-3.5 font-display text-lg font-semibold text-ink shadow-card transition-transform active:scale-[0.98]"
        >
          I&rsquo;m {voter.name}, let&rsquo;s vote
        </button>
      </div>
    )
  }

  if (step === STEPS.RECORDED) {
    return (
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-4 font-display text-2xl font-semibold text-paper">Vote recorded.</p>
        <p className="mt-2 text-sm text-paper-dim">Pass the phone to the next player.</p>
        <button
          type="button"
          onClick={handleContinue}
          className="mt-10 w-full max-w-xs rounded-xl border border-line-strong py-3.5 font-display text-lg font-semibold text-paper transition-colors hover:border-accent/60"
        >
          Continue
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col px-5 pb-8 pt-4">
      <header className="text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-paper-faint">
          {voter.name}&rsquo;s vote
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-paper">Who is the Imposter?</h1>
      </header>

      <fieldset className="mt-6 flex flex-col gap-2">
        <legend className="sr-only">Choose who you suspect is the Imposter</legend>
        {suspects.map((suspect) => {
          const isSelected = selectedSuspectId === suspect.id
          return (
            <label
              key={suspect.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors ${
                isSelected
                  ? 'border-accent bg-accent/10'
                  : 'border-line bg-ink-raised/50 hover:border-line-strong'
              }`}
            >
              <input
                type="radio"
                name="suspect"
                value={suspect.id}
                checked={isSelected}
                onChange={() => setSelectedSuspectId(suspect.id)}
                className="h-5 w-5 accent-accent"
              />
              <span className="font-medium text-paper">{suspect.name}</span>
            </label>
          )
        })}
      </fieldset>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!selectedSuspectId}
        className="mt-auto w-full rounded-xl bg-accent py-3.5 font-display text-lg font-semibold text-ink shadow-card transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30"
      >
        Confirm vote
      </button>
    </div>
  )
}
