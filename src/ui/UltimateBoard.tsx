import React, { useEffect, useMemo, useState } from "react";
import { Game } from "../engine/Game.js";
import type { Move } from "../engine/index.js";

export function UltimateBoard() {
  const [game, setGame] = useState(() => new Game());
  const view = useMemo(() => game.getView(), [game]);
  const [showDebug, setShowDebug] = useState(false);

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

  function playRandomMoves(count: number) {
    setGame((prev) => {
      let g = prev;

      for (let i = 0; i < count; i++) {
        if (g.getStatus().kind !== "playing") break;

        const moves = g.legalMoves();
        if (moves.length === 0) break;

        const pick = moves[Math.floor(Math.random() * moves.length)];
        if (!pick) break;

        const next = g.tryApplyMove(pick);
        if (!next) break;
        g = next;
      }

      return g;
    });
  }

  function playToEnd(maxPlies: number = 300) {
    playRandomMoves(maxPlies);
  }

  return (
    <div className="container">
      <div className="topBar">
        <div className="headerActions">
          <button
            className="secondary"
            onClick={() => setShowDebug((v) => !v)}
            type="button"
          >
            Debug
          </button>

          <button onClick={reset} type="button">
            Reset
          </button>
        </div>

        {view.status.kind === "playing" && (
          <div className="turnHero">
            <div className={`turnText player-${view.currentPlayer}`}>
              {view.currentPlayer}<span className='smallTurnText'> to play</span>
            </div>
          </div>
        )}
      </div>

      {showDebug && (
        <div className="debugPanel">
          <div className="debugRow">
            <button onClick={() => playRandomMoves(1)} type="button">Random 1</button>
            <button onClick={() => playRandomMoves(5)} type="button">Random 5</button>
            <button onClick={() => playRandomMoves(20)} type="button">Random 20</button>
            <button onClick={() => playToEnd()} type="button">Finish game</button>
          </div>

          <div className="debugRow">
            <button onClick={() => setShowResult(true)} type="button">Show result modal</button>
            <button onClick={() => setShowResult(false)} type="button">Hide result modal</button>
          </div>

          <div className="debugHint">
            Tip: gebruik “Finish game” om snel je overlays / eindscherm te testen.
          </div>
        </div>
      )}

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
                          className={`cell ${mark !== "." ? mark : ""}`}
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
                  <div className={`winner-overlay ${small.winner}`}>
                    {small.winner}
                  </div>
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
