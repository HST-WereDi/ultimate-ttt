import React, { useState } from "react";
import { UltimateBoard } from "./UltimateBoard";
import { Landing } from "./Landing";
import { Rules } from "./Rules";

type Screen = "landing" | "local" | "ai" | "rules";

export function App() {
  const [screen, setScreen] = useState<Screen>("landing");

  if (screen === "local") {
    return <UltimateBoard onBack={() => setScreen("landing")} />;
  }

  if (screen === "rules") {
    return <Rules onBack={() => setScreen("landing")} />;
  }

  if (screen === "ai") {
    // placeholder tot je AI er is
    return (
      <div className="utt-shell">
        <div className="utt-panel utt-card">
          <h1 className="utt-title utt-h1">Single Player</h1>
          <p className="utt-muted">The AI is still sleeping in the crypt…</p>
          <button className="utt-btn" onClick={() => setScreen("landing")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <Landing
      onLocal={() => setScreen("local")}
      onAI={() => setScreen("ai")}
      onRules={() => setScreen("rules")}
    />
  );
}