Ultimate Tic Tac Toe Engine

A fully type-safe, immutable Ultimate Tic Tac Toe engine written in TypeScript.

This project focuses purely on engine correctness and deterministic game logic.
No UI or networking code is included in the core engine.

✨ Features

Immutable game state

Strict TypeScript configuration

Full rule enforcement

Macro winner detection

Draw detection

Legal move generation

Comprehensive unit tests (Vitest)

🧱 Architecture Overview

The engine is built around two core classes:

SmallBoard

Represents a single 3×3 Tic Tac Toe board.

Responsibilities:

Store cell state

Validate placements

Detect local winners

Detect local draws

Support cloning

Internally mutable, but used immutably at higher levels.

UltimateBoard

Represents the 3×3 grid of SmallBoard instances.

Responsibilities:

Enforce Ultimate Tic Tac Toe constraint rules

Apply moves immutably

Detect macro winner

Detect macro draw

Generate legal moves

applyMove() always returns a new UltimateBoard instance.

🔁 Immutability Model

The engine uses an immutable macro state model:

UltimateBoard instances are never mutated.

applyMove() returns a new board.

Only the targeted SmallBoard is cloned and modified.

This makes the engine:

Safe for AI search (minimax / MCTS)

Safe for multiplayer synchronization

Deterministic and side-effect free

🎮 Rule Enforcement

After a move is played in:

(boardRow, boardCol) → (cellRow, cellCol)


The next move is constrained to:

(cellRow, cellCol)


If the constrained board is:

already won, or

completely full,

the constraint is lifted.

🧪 Testing

Unit tests are written using Vitest.

Run all tests:

npm test


The test suite verifies:

SmallBoard behavior

Winner detection

Draw detection

Constraint enforcement

Immutability guarantees

Legal move generation

📚 Documentation

API documentation is generated using TypeDoc.

Generate docs:

npm run docs


Open:

/docs/index.html

🚀 Planned Features

Game class with turn tracking

AI player (minimax)

WebSocket multiplayer

React frontend

Room-based multiplayer sessions

🛠 Development

Build:

npm run build


Run tests:

npm test


Generate docs:

npm run docs

📦 Tech Stack

TypeScript (strict mode)

ES Modules (nodenext)

Vitest

TypeDoc

📄 License

MIT