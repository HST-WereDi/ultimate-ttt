import React, { useEffect, useMemo, useState } from "react";
import { Game } from "../engine/Game.js";
import type { Move } from "../engine/index.js";

export function UltimateBoard() {
  const [game, setGame] = useState(() => new Game());
  const view = useMemo(() => game.getView(), [game]);

  const isOver = view.status.kind !== "playing";

  const winnerText =
    view.status.kind === "won"
      ? `Winner: ${view.status.winner}`
      : view.status.kind === "draw"
      ? "Draw"
      : "";

  const [showResult, setShowResult] = useState(true);

  // Als het spel eindigt (win/draw), forceer modal weer open
  useEffect(() => {
    if (isOver) setShowResult(true);
  }, [isOver]);

  const shouldShowModal = isOver && showResult;

  function handleClick(move: Move) {
    const next = game.tryApplyMove(move);
    if (next) setGame(next);
  }

  function reset() {
    setGame(new Game());
    setShowResult(true);
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          {view.status.kind === "playing" ? (
            <>
              <div>Aan zet: {view.currentPlayer}</div>
              <div className="sub">
                {view.nextBoard
                  ? `Volgend miniboard: (${view.nextBoard.row}, ${view.nextBoard.col})`
                  : "Vrije keuze"}
              </div>
            </>
          ) : view.status.kind === "won" ? (
            <div>Gewonnen: {view.status.winner}</div>
          ) : (
            <div>Gelijkspel</div>
          )}
        </div>

        <button onClick={reset} type="button">
          Reset
        </button>
      </div>

      <div className="macro-board">
        {view.boards.map((row, br) =>
          row.map((small, bc) => {
            const isNext =
              view.nextBoard !== null &&
              view.nextBoard.row === br &&
              view.nextBoard.col === bc;

            const constrained = view.nextBoard !== null;
            const playable =
              small.isPlayable && (!constrained || isNext) && !small.winner;

            return (
              <div
                key={`${br}-${bc}`}
                className={[
                  "micro-board",
                  isNext ? "active" : "",
                  playable ? "" : "dimmed",
                ].join(" ")}
              >
                <div className="micro-grid">
                  {small.grid.map((r, cr) =>
                    r.map((mark, cc) => {
                      const move: Move = {
                        boardRow: br,
                        boardCol: bc,
                        cellRow: cr,
                        cellCol: cc,
                      };

                      const canClick = playable && mark === ".";

                      return (
                        <button
                          key={`${cr}-${cc}`}
                          className="cell"
                          disabled={!canClick}
                          onClick={() => handleClick(move)}
                          type="button"
                        >
                          {mark === "." ? "" : mark}
                        </button>
                      );
                    })
                  )}
                </div>

                {small.winner && (
                  <div className="winner-overlay">{small.winner}</div>
                )}
              </div>
            );
          })
        )}
      </div>

      {shouldShowModal && (
        <div className="overlay">
          <div className="modal">
            <div className="modalTitle">{winnerText}</div>

            <div className="modalActions">
              <button className="modalBtn" onClick={reset} type="button">
                Play again
              </button>

              <button
                className="modalBtn secondary"
                onClick={() => setShowResult(false)}
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
