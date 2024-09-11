import { min, max } from "./utils.js";

//#region	Constants

export const CROSS = "X";
export const NOUGHT = "O";
export const GRID_SIZE = 9;
const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export const EMPTY_GRID = Array(GRID_SIZE).fill(null);

export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//#endregion

//#region Classes

class Node {
  constructor({ grid = EMPTY_GRID, moves = [] }) {
    this.forks = [];
    this.grid = grid;
    this.moves = moves;
    this.winner = getWinner(this.grid);
    this.score = this.calculateScore();
  }

  // Explore all possible moves on next turn
  grow() {
    const nextMoves = getEmptyCells(this.grid);

    for (const move of nextMoves) {
      const moves = this.moves.concat(move);
      const grid = this.grid.slice();
      grid[move] = this.getPlayer();

      const fork = new Node({ grid, moves });
      this.forks.push(fork);
    }
  }

  // Check if game is over
  isLeaf() {
    return this.winner !== null || this.moves.length === GRID_SIZE;
  }

  // Calculate the score of the game, 1 if X wins, -1 if O wins, 0 if a tie
  calculateScore() {
    if (this.winner === null) {
      return 0;
    }

    return this.winner === CROSS ? 1 : -1;
  }

  // Get the player of this turn
  getPlayer() {
    return this.moves.length % 2 === 0 ? CROSS : NOUGHT;
  }
}

//#endregion

const root = new Node({});
buildTree(root);

//#region Main Functions

// Build the game tree, using minimax to score each move
function buildTree(node) {
  // base case
  if (node.isLeaf()) {
    return node.score;
  }

  node.grow();
  const scores = node.forks.map((fork) => buildTree(fork));

  // X choose move with highest score, O the lowest
  if (node.getPlayer() === CROSS) {
    node.score = max(scores);
  } else {
    node.score = min(scores);
  }

  return node.score;
}

// Get moves with the highest score
export function getBestMoves(grid, moves, player) {
  const winningMoves = getWinningMove(grid, player);

  // But if we can win the game now, why not?
  if (winningMoves.length > 0) {
    return winningMoves;
  }

  const node = search(root, moves);
  const scores = node.forks.map((fork) => fork.score);

  let bestScore;

  // X choose move with highest score, O the lowest
  if (node.getPlayer() === CROSS) {
    bestScore = max(scores);
  } else {
    bestScore = min(scores);
  }

  const bestMoves = node.forks
    .filter((fork) => fork.score === bestScore)
    .map((fork) => fork.moves.at(-1));

  return bestMoves;

  // helper function to search for the node matching the move chain
  function search(tree, moves) {
    // found it
    if (moves.length === 0) {
      return tree;
    }

    const move = moves[0];

    // explore node with the same move at each turn
    for (const fork of tree.forks) {
      if (fork.moves.at(-1) === move) {
        return search(fork, moves.slice(1));
      }
    }

    throw "Not Found!";
  }
}

// See if we can win the game with 1 move
function getWinningMove(grid, player) {
  const winningMoves = new Set();

  for (const line of LINES) {
    const [i, j, k] = line;
    const [ith, jth, kth] = [grid[i], grid[j], grid[k]];

    if (ith === null && jth === player && jth === kth) {
      winningMoves.add(i);
    } else if (jth === null && ith === player && ith === kth) {
      winningMoves.add(j);
    } else if (kth === null && ith === player && ith === jth) {
      winningMoves.add(k);
    }
  }

  return [...winningMoves];
}

export function getWinner(grid) {
  for (const line of LINES) {
    const [i, j, k] = line;
    const [ith, jth, kth] = [grid[i], grid[j], grid[k]];

    if (ith !== null && ith === jth && jth === kth) {
      return ith;
    }
  }

  return null;
}

export function getEmptyCells(grid) {
  return CELLS.filter((cell) => grid[cell] === null);
}

//#endregion
