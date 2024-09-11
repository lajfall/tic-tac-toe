import { getRandomItem } from "../lib/utils.js";
import { X, Circle, RotateCw } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { CROSS, NOUGHT, getBestMoves } from "../lib/game.js";
import { makeMove, initialState, getNthChildNode } from "../lib/helper.js";

function GameBoard() {
  const boardRef = useRef(null);
  const [game, setGame] = useState(initialState);
  const [computer, setComputer] = useState(NOUGHT);

  // Computer's Move
  useEffect(() => {
    const board = boardRef.current;

    if (board !== null && !game.over && game.turn === computer) {
      setTimeout(() => {
        const options = getBestMoves(game.grid, game.moves, game.turn);
        const move = getRandomItem(options);
        const cell = getNthChildNode(board, move);
        const newState = makeMove(game, cell, move);
        setGame(newState);
      }, 750);
    }
  }, [game, computer]);

  function restartGame() {
    setComputer(NOUGHT);
    setGame(initialState);

    boardRef.current.childNodes.forEach((cell) => {
      cell.style.backgroundColor = "white";
    });
  }

  function letAIGoFirst() {
    if (game.moves.length === 0 && computer === NOUGHT) {
      setComputer(CROSS);
    }
  }

  function handleUserMove(cell, move) {
    if (game.over || game.turn === computer) {
      return;
    }

    const newState = makeMove(game, cell, move);
    setGame(newState);
  }

  return (
    <div className="flex h-full flex-col items-center justify-around">
      <div
        ref={boardRef}
        className={`grid size-60 grid-cols-3 items-center justify-center ${
          game.turn === computer ? "pointer-events-none" : "pointer-events-auto"
        } `}
      >
        {game.grid.map((marker, i) => (
          <div
            key={i}
            onClick={(e) => handleUserMove(e.target, i)}
            className={`flex size-20 cursor-pointer items-center justify-center ${
              game.moves.includes(i)
                ? "pointer-events-none"
                : "pointer-events-auto"
            } ${i < 6 ? "border-b" : ""} ${
              i % 3 < 2 ? "border-r" : ""
            } border-black`}
          >
            {marker === CROSS && <X size={40} />}
            {marker === NOUGHT && <Circle size={32} />}
          </div>
        ))}
      </div>
      <div className="flex h-10 justify-center">
        {game.over && (
          <RotateCw onClick={restartGame} className="size-10 md:size-12" />
        )}
        {!game.over && game.moves.length === 0 && (
          <button
            onClick={letAIGoFirst}
            className="rounded border border-gray-400 px-3 py-1.5 text-gray-700 hover:shadow"
          >
            AI FIRST
          </button>
        )}
      </div>
    </div>
  );
}

export default GameBoard;
