Ultimate Tic Tac Toe Engine – Architecture Overview
1. Design Goals

The engine is designed with the following principles:

Correctness first

Immutable game state

Strict type safety (TypeScript strict mode)

No side effects

Deterministic behavior (AI- and multiplayer-safe)

The engine is UI-agnostic and contains no rendering logic.

2. Core Concepts
2.1 SmallBoard

Represents a single 3×3 Tic Tac Toe board.

Responsibilities:

Store cell state

Validate placements

Detect local winners

Detect full-board (draw) state

Support cloning for immutable macro state updates

Characteristics:

Internally mutable

Treated as immutable at the UltimateBoard level (via cloning)

2.2 UltimateBoard

Represents the full 3×3 grid of SmallBoard instances.

Responsibilities:

Store macro structure

Enforce Ultimate Tic Tac Toe move constraints

Apply moves immutably

Detect macro winner

Detect macro draw

Generate legal moves

Immutability Model

UltimateBoard is immutable:

applyMove() returns a new instance

Existing instances are never modified

Only the targeted SmallBoard is cloned and changed

This design simplifies:

AI search (minimax / MCTS)

Multiplayer synchronization

Time-travel debugging

State comparison

3. Move Constraint System

After a move is played in:

(boardRow, boardCol) → (cellRow, cellCol)


The next move is constrained to:

(cellRow, cellCol)


If that small board:

is won, or

is full

then the constraint is lifted.

nextBoard === null means free choice.

4. Game State Evaluation
Macro Winner

A macro winner occurs when three small boards in a row, column, or diagonal are won by the same player.

Draw

A draw occurs when:

There is no macro winner

No legal moves remain

5. Legal Move Generation

legalMoves() returns:

All empty cells inside the constrained small board

Or all empty cells in all playable small boards if no constraint applies

This method is critical for:

Game validation

AI move generation

Multiplayer verification

Draw detection

6. Error Handling Philosophy

Errors are thrown when:

A move is applied after game over

A move violates constraint rules

A move targets an invalid or occupied cell

Internal invariants are violated

Out-of-range access is treated as a programming error, not user error.

7. Current Engine Scope

Implemented:

SmallBoard logic

UltimateBoard logic

Immutability enforcement

Macro winner detection

Draw detection

Legal move generation

Full unit test coverage

Not yet implemented:

Turn tracking

Game class

AI player

WebSocket multiplayer

UI integration

8. Next Step

Introduce a Game class responsible for:

Current player tracking

Applying moves via UltimateBoard

Exposing overall status (playing | won | draw)

Enforcing turn order