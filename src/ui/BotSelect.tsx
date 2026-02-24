import React from "react";
import { BOTS } from "../engine/ai/registry.js";
import type { BotId } from "../engine/ai/types";

export function BotSelect(props: {
  onBack: () => void;
  onChoose: (id: BotId) => void;
}) {
  return (
    <div className="utt-shell">
      <div className="utt-panel utt-card">
        <h1 className="utt-title utt-h1">Choose Thy Opponent</h1>
        <p className="utt-muted">Select a foe to face in the arena.</p>

        <div className="utt-menu">
          {BOTS.map((bot) => (
            <button
              key={bot.id}
              className="utt-btn utt-btn--big"
              onClick={() => props.onChoose(bot.id)}
              type="button"
            >
              {bot.name}
              <div className="utt-muted" style={{ fontSize: 13, marginTop: 6 }}>
                {bot.description}
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <button className="utt-btn" onClick={props.onBack} type="button">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}