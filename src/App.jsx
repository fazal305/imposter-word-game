import { DiscussionScreen } from './components/DiscussionScreen'
import { GameOverScreen } from './components/GameOverScreen'
import { ProgressIndicator } from './components/ProgressIndicator'
import { RoleRevealScreen } from './components/RoleRevealScreen'
import { SetupScreen } from './components/SetupScreen'
import { VoteResultsScreen } from './components/VoteResultsScreen'
import { VotingScreen } from './components/VotingScreen'
import { useGame } from './hooks/useGame'
import { PHASES } from './utils/gameLogic'

export default function App() {
  const { state, actions } = useGame()

  return (
    <div className="min-h-dvh bg-ink">
      {state.phase !== PHASES.SETUP && state.phase !== PHASES.GAME_OVER && (
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
        <DiscussionScreen
          players={state.players}
          roundNumber={state.roundNumber}
          onStartVoting={actions.startVoting}
        />
      )}

      {state.phase === PHASES.VOTING && (
        <VotingScreen
          players={state.players}
          currentVoterIndex={state.currentVoterIndex}
          onCastVote={actions.castVote}
        />
      )}

      {state.phase === PHASES.VOTE_RESULT && (
        <VoteResultsScreen
          players={state.players}
          voteResult={state.voteResult}
          onContinue={actions.continueToGameOver}
        />
      )}

      {state.phase === PHASES.GAME_OVER && (
        <GameOverScreen
          players={state.players}
          roles={state.roles}
          imposterId={state.imposterId}
          agentWord={state.agentWord}
          imposterWord={state.imposterWord}
          winner={state.winner}
          onPlayAgain={actions.playAgain}
          onNewGame={actions.newGame}
        />
      )}
    </div>
  )
}
