# Ultimate Tic Tac Toe

A fully type-safe, immutable Ultimate Tic Tac Toe implementation written in TypeScript.

This project contains:

- A deterministic, side-effect free engine
- An immutable Game state machine
- A responsive React UI (Vite)
- Comprehensive unit tests (Vitest)

Engine correctness is the highest priority.

---

## Features

### Engine

- Immutable game state
- Strict TypeScript configuration
- Deterministic behavior
- Full rule enforcement
- Constraint system (`nextBoard`)
- Macro winner detection
- Classic draw detection (no moves left)
- Forced draw detection (no macro winner possible)
- Legal move generation
- Safe `tryApplyMove()` API
- Comprehensive unit tests

### UI (v1)

- Responsive layout (viewport scaling)
- Active next-board highlighting
- Win / draw modal
- Close and Play Again options
- Clean separation from engine
- No Tailwind dependency

---

## Architecture Overview
src/
engine/
SmallBoard.ts
UltimateBoard.ts
Game.ts
index.ts
UI/
UltimateBoard.tsx


### Engine Layer

Pure logic only.

- No React
- No DOM
- No randomness
- No side effects

### UI Layer

React + Vite frontend.

Uses:

- `Game.getView()` for rendering
- `tryApplyMove()` for safe interaction

The UI never mutates engine state.

---

## Immutability Model

- `SmallBoard` is internally mutable but cloned before modification.
- `UltimateBoard` is immutable.
- `Game` is immutable.
- `applyMove()` always returns a new instance.

Safe for:

- AI search
- Multiplayer synchronization
- State comparison
- Time-travel debugging

---

## Rule System

After a move in:

(boardRow, boardCol) → (cellRow, cellCol)

The next move is constrained to:

(cellRow, cellCol)

If that small board:

- is already won, or
- is full,

the constraint is lifted (`nextBoard === null`).

---

## Draw Conditions

A game is a draw if:

1. No macro winner exists, and
2. Either:
   - No legal moves remain (classic draw), or
   - A macro winner is no longer possible for either player (forced draw)

---

## Testing

Tests are written using Vitest.

Run all tests:

npm test

Tests verify:

- SmallBoard behavior
- Constraint enforcement
- Immutability guarantees
- Winner detection
- Classic draw detection
- Forced draw detection
- Game.tryApplyMove behavior

---

## Development

Start dev server:

npm run dev

Build:

npm run build

Generate documentation:

npm run docs

---

## Tech Stack

- TypeScript (strict mode)
- ES Modules
- React
- Vite
- Vitest
- TypeDoc

---

## Roadmap

- RandomAgent
- MinimaxAgent
- Online multiplayer (WebSockets)
- Room system
- ELO rating system
- Server deployment

---

## License

MIT
