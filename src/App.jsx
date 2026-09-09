import { PlaceholderPhase } from './components/PlaceholderPhase'
import { ProgressIndicator } from './components/ProgressIndicator'
import { RoleRevealScreen } from './components/RoleRevealScreen'
import { SetupScreen } from './components/SetupScreen'
import { useGame } from './hooks/useGame'
import { PHASES } from './utils/gameLogic'

export default function App() {
  const { state, actions } = useGame()

  return (
    <div className="min-h-dvh bg-ink">
      {state.phase !== PHASES.SETUP && (
        <div className="sticky top-0 z-10 bg-ink/80 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm">
          <ProgressIndicator phase={state.phase} />
        </div>
      )}

      {state.phase === PHASES.SETUP && (
        <SetupScreen onStart={actions.startNewGame} />
      )}

      {state.phase === PHASES.ROLE_REVEAL && (
        <RoleRevealScreen
          key={state.players[state.currentRevealIndex].id}
          player={state.players[state.currentRevealIndex]}
          secret={state.roles[state.players[state.currentRevealIndex].id]}
          index={state.currentRevealIndex}
          total={state.players.length}
          onContinue={actions.advanceReveal}
        />
      )}

      {state.phase === PHASES.DISCUSSION && (
        <PlaceholderPhase
          title="Discussion"
          description="Give your clues, then head to voting."
          onBack={actions.newGame}
        />
      )}

      {state.phase === PHASES.VOTING && (
        <PlaceholderPhase
          title="Voting"
          description="Private pass-and-play voting is coming next."
          onBack={actions.newGame}
        />
      )}

      {state.phase === PHASES.VOTE_RESULT && (
        <PlaceholderPhase
          title="Vote Results"
          description="The reveal and winner screen is coming next."
          onBack={actions.newGame}
        />
      )}

      {state.phase === PHASES.GAME_OVER && (
        <PlaceholderPhase
          title="Game Over"
          description="Final reveal and rematch flow is coming next."
          onBack={actions.newGame}
        />
      )}
    </div>
  )
}
