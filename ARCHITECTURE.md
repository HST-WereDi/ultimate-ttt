# Ultimate Tic Tac Toe – Architecture

## 1. Design Principles

The project is built around the following principles:

- Correctness first
- Immutable state
- Deterministic behavior
- Strict type safety
- Clear separation between engine and UI

The engine is completely UI-agnostic.

---

## 2. Layered Structure
src/
engine/
UI/


### Engine (src/engine)

Pure logic layer.

Contains:

- SmallBoard
- UltimateBoard
- Game

No rendering.
No side effects.
No randomness.
No networking.

---

### UI (src/UI)

React-based frontend.

Responsibilities:

- Rendering the board
- Handling user interaction
- Highlighting the constrained board
- Displaying status and result modal

The UI consumes engine state but never mutates it.

---

## 3. SmallBoard

Represents a single 3×3 Tic Tac Toe board.

Responsibilities:

- Store cell state
- Validate placements
- Detect local winner
- Detect full state
- Support cloning

Internally mutable, but only modified through cloning at higher levels.

---

## 4. UltimateBoard

Represents the 3×3 grid of SmallBoard instances.

Responsibilities:

- Enforce Ultimate Tic Tac Toe constraint rules
- Apply moves immutably
- Detect macro winner
- Detect draw (classic and forced)
- Generate legal moves

Immutability model:

- `applyMove()` returns a new UltimateBoard
- Only the targeted SmallBoard is cloned
- Existing board instances are never modified

---

## 5. Game

Pure immutable state machine.

Responsibilities:

- Track current player
- Enforce turn order
- Validate moves
- Expose overall status
- Provide render-safe snapshot via `getView()`

Move APIs:

- `applyMove()` → strict, throws on illegal move
- `tryApplyMove()` → safe wrapper returning null

---

## 6. Constraint System

After a move in:

(boardRow, boardCol) → (cellRow, cellCol)

The next move must be played in:

(cellRow, cellCol)

If that board is:

- won, or
- full,

the constraint is lifted (`nextBoard === null`).

---

## 7. Draw Detection

Two draw modes exist:

### Classic Draw

- No macro winner
- No legal moves remain

### Forced Draw

- No macro winner
- No possible macro winning line for either player

Forced draw detection prevents unnecessary continued play when a win is mathematically impossible.

---

## 8. Determinism

The engine guarantees:

- No hidden state
- No time dependency
- No randomness
- Referential transparency

This makes it safe for:

- AI search (minimax / MCTS)
- Multiplayer synchronization
- State comparison
- Snapshot testing

---

## 9. Current Scope (v1)

Implemented:

- Full engine
- Game state machine
- Forced draw logic
- Responsive React UI
- Win/draw modal
- Comprehensive unit tests

Not yet implemented:

- AI agents
- Multiplayer
- Server deployment
- Rating system
