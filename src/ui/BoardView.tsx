import React from "react";
import type { Move } from "../engine/index.js";
import type { GameView } from "../engine/Game.js";

export function BoardView(props: {
  view: GameView;
  onClickMove: (move: Move) => void;
  disabled?: boolean; // handig voor AI turn
}) {
  const { view, onClickMove, disabled = false } = props;

  return (
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

                    const canClick = !disabled && playable && mark === ".";

                    return (
                        <button
                        key={`${cr}-${cc}`}
                        className={[
                            "cell",
                            mark === "X" ? "utt-mark-x" : "",
                            mark === "O" ? "utt-mark-o" : "",
                        ].join(" ")}
                        disabled={!canClick}
                        onClick={() => onClickMove(move)}
                        type="button"
                        >
                        {mark === "." ? "" : mark}
                        </button>
                    );
                  })
                )}
              </div>

                {small.winner && (
                <div
                    className={[
                    "winner-overlay",
                    small.winner === "X" ? "utt-mark-x" : "",
                    small.winner === "O" ? "utt-mark-o" : "",
                    ].join(" ")}
                >
                    {small.winner}
                </div>
                )}
            </div>
          );
        })
      )}
    </div>
  );
}