import React from "react";

export function Landing(props: {
  onLocal: () => void;
  onAI: () => void;
  onRules: () => void;
}) {
  return (
    <div className="utt-shell">
      <div className="utt-panel utt-card">
        <div className="utt-brand">
          <div className="utt-kicker">Arena of Petty Glory</div>
          <h1 className="utt-title utt-h1">ULTIMATE TIC TAC TOE</h1>
          <p className="utt-muted">
            Choose thy path, challenger.
          </p>
        </div>

        <div className="utt-menu">
          <button className="utt-btn utt-btn--big" onClick={props.onLocal}>
            Local Multiplayer
          </button>
          <button className="utt-btn utt-btn--big" onClick={props.onAI}>
            Single Player (AI)
          </button>
          <button className="utt-btn utt-btn--big" onClick={props.onRules}>
            Rules
          </button>
        </div>

        <div className="utt-footnote utt-muted">
          Online multiplayer arrives… later.
        </div>
      </div>
    </div>
  );
}