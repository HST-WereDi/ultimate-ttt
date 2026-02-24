import React from "react";

export function Rules({ onBack }: { onBack: () => void }) {
  return (
    <div className="utt-shell">
      <div className="utt-panel utt-card utt-rules">
        <h1 className="utt-title utt-h1">The Laws of the Arena</h1>

        <section>
          <h2>⚔ The Battlefield</h2>
          <p>
            The arena consists of nine small boards arranged in a grand square.
            Each small board is itself a game of Tic Tac Toe.
          </p>
        </section>

        <section>
          <h2>🛡 The First Move</h2>
          <p>
            The first player may claim any cell in any small board.
          </p>
        </section>

        <section>
          <h2>🏹 The Binding Rule</h2>
          <p>
            The cell you choose determines where your opponent must play next.
            If you place your mark in the top-right cell of a board,
            your opponent must play in the top-right board of the arena.
          </p>
        </section>

        <section>
          <h2>👑 Claiming a Board</h2>
          <p>
            Win a small board as in normal Tic Tac Toe to claim it.
            Once claimed, that board belongs to you and cannot be played again.
          </p>
        </section>

        <section>
          <h2>🏆 Victory</h2>
          <p>
            Claim three small boards in a row across the grand arena —
            horizontally, vertically, or diagonally — and you seize ultimate glory.
          </p>
        </section>

        <section>
          <h2>⚖ When Fate Intervenes</h2>
          <p>
            If you are sent to a board that has already been won or filled,
            you may choose any open board for your move.
          </p>
        </section>

        <div className="utt-rules-actions">
          <button className="utt-btn" onClick={onBack}>
            Return to the Arena
          </button>
        </div>
      </div>
    </div>
  );
}