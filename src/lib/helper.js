import { CROSS, NOUGHT, LINES, GRID_SIZE, EMPTY_GRID } from "./game.js";

const MARKERS = [CROSS, NOUGHT];

export const initialState = {
  turn: CROSS,
  moves: [],
  over: false,
  grid: EMPTY_GRID,
};

export function makeMove(game, cell, move) {
  if (game.over || game.moves.includes(move)) {
    return;
  }

  let { grid, moves, turn, over } = game;

  grid = [...grid];
  grid[move] = turn;
  moves = [...moves, move];
  turn = MARKERS[moves.length % 2];

  const line = getConnectedLine(grid);

  if (line !== null) {
    over = true;
    const cells = cell.parentNode.childNodes;

    cells.forEach((cell, i) => {
      if (line.includes(i)) {
        cell.style.backgroundColor = "lightgreen";
      }
    });
  }

  if (moves.length === GRID_SIZE) {
    over = true;
  }

  return { grid, moves, turn, over };
}

export function getNthChildNode(parentNode, n) {
  return Array.from(parentNode.childNodes)[n];
}

function getConnectedLine(grid) {
  for (const line of LINES) {
    const [i, j, k] = line;
    const [ith, jth, kth] = [grid[i], grid[j], grid[k]];

    if (ith !== null && ith === jth && jth === kth) {
      return line;
    }
  }

  return null;
}
