import React from "react";
import { BoardView } from "./BoardView";
import type { Move } from "../engine/index.js";
import type { GameView } from "../engine/Game.js";

export function GameScreen(props: {
  view: GameView;

  // acties
  onMove: (move: Move) => void;
  onReset: () => void;
  onBack?: () => void;

  // UI tekst
  title: string;         // bijv "Local Multiplayer" of "Single Player"
  subtitle?: string;     // bijv "(Billy Random)" of iets anders
  turnText: string;


  // state
  boardDisabled?: boolean;

  // modal
  showResult: boolean;
  onCloseResult: () => void;
  resultText: string;    // "Winner: X" / "Draw"
}) {
  const {
    view,
    onMove,
    onReset,
    onBack,
    title,
    subtitle,
    boardDisabled = false,
    showResult,
    onCloseResult,
    resultText,
    turnText
  } = props;

  const isOver = view.status.kind !== "playing";

  return (
    <div className="container">
 {/* =========================
    TOP BAR
========================= */}

        <div className="topBar">
        {/* Knoppen links */}
        <div className="headerActions">
            {onBack && (
            <button onClick={onBack} type="button">
                Back
            </button>
            )}
            <button onClick={onReset} type="button">
            Reset
            </button>
        </div>

        {/* Hero Turn Display */}
        <div className="turnHero">
            {view.status.kind === "playing" ? (
            <>
                <div
                className={[
                    "turnPlayer",
                    view.currentPlayer === "X" ? "player-X" : "player-O",
                ].join(" ")}
                >
                {view.currentPlayer}
                </div>

                <div className="smallTurnText">
                {turnText}
                </div>
            </>
            ) : (
            <div className="turnText">{resultText}</div>
            )}
        </div>
        </div>

      <BoardView view={view} onClickMove={onMove} disabled={boardDisabled} />

      {isOver && showResult && (
        <div className="overlay">
          <div className="modal">
            <div className="modalTitle">{resultText}</div>

            <div className="modalActions">
              <button className="modalBtn" onClick={onReset} type="button">
                Play again
              </button>

              <button
                className="modalBtn secondary"
                onClick={onCloseResult}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}