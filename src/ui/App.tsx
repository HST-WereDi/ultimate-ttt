import React, { useState } from "react";
import { UltimateBoard } from "./UltimateBoard";
import { Landing } from "./Landing";
import { Rules } from "./Rules";
import { BotSelect } from "./BotSelect";
import { SinglePlayer } from "./SinglePlayer";
import type { BotId } from "../engine/ai/types";

type Screen = "landing" | "local" | "ai_select" | "ai_play" | "rules";

export function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [botId, setBotId] = useState<BotId>("billy-random");

  if (screen === "local") {
    return <UltimateBoard onBack={() => setScreen("landing")} />;
  }

  if (screen === "rules") {
    return <Rules onBack={() => setScreen("landing")} />;
  }

    if (screen === "ai_select") {
    return (
        <BotSelect
        onBack={() => setScreen("landing")}
        onChoose={(id) => {
            setBotId(id);
            setScreen("ai_play");
        }}
        />
    );
    }

    if (screen === "ai_play") {
    return <SinglePlayer botId={botId} onBack={() => setScreen("ai_select")} />;
    }

  return (
    <Landing
      onLocal={() => setScreen("local")}
      onAI={() => setScreen("ai_select")}
      onRules={() => setScreen("rules")}
    />
  );
}