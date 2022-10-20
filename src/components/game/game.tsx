import { useState } from "react";
import { Board } from "../board/board";
import "./game.scss";

export type OnClickSquare = (clickedSquareIndex: number) => void;
export type Square = Array<string | null>;
export type GameHistory = {
  squares: Square;
  lastSquare: number | null;
  winner: Winner | null;
};
export type Winner = {
  symbol: string;
  lines: number[];
};

export const Game = (): JSX.Element => {
  const maximumMoves = 9;
  const [histories, setHistories] = useState<GameHistory[]>([
    {
      squares: Array(9).fill(null),
      lastSquare: null,
      winner: null,
    },
  ]);
  const [moveNumber, setMoveNumber] = useState<number>(0);
  const [isAscendingHistory, setIsAscendingHistory] = useState<boolean>(true);

  const getSymbol = (currentMoveNumber: number): string => {
    return currentMoveNumber % 2 === 0 ? "X" : "O";
  };

  const getNextSymbol = (): string => {
    return getSymbol(moveNumber);
  };

  const calculateWinner = (squares: Square): Winner | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return {
          symbol: squares[a]!,
          lines: lines[i],
        };
      }
    }
    return null;
  };

  const onClickHistory = (moveNumber: number): void => {
    setMoveNumber(moveNumber);
  };

  const onClickHistorySortToggle = (): void => {
    setIsAscendingHistory(!isAscendingHistory);
  };

  const onClickSquare: OnClickSquare = (clickedSquareIndex) => {
    // current history may defers if user "time travel" to past moves
    const activeHistories = histories.slice(0, moveNumber + 1);
    const lastActiveMove = activeHistories[activeHistories.length - 1];

    const isSquareFilled = !!lastActiveMove.squares[clickedSquareIndex];
    if (isSquareFilled) return;
    const hasWinner = !!lastActiveMove.winner;
    if (hasWinner) return;

    const squares = [...lastActiveMove.squares];
    squares[clickedSquareIndex] = getNextSymbol();
    const winner = calculateWinner(squares);
    setHistories([
      ...activeHistories,
      {
        squares: squares,
        lastSquare: clickedSquareIndex,
        winner: winner,
      },
    ]);
    setMoveNumber(activeHistories.length);
  };

  const lastMove = histories[moveNumber];
  const hasWinner = !!lastMove.winner;
  const isOutOfMove = moveNumber === maximumMoves;
  const gameEndedClass = hasWinner || isOutOfMove ? "game-ended" : "";
  const outOfMoveClass = !hasWinner && isOutOfMove ? "out-of-move" : "";
  let status;
  if (hasWinner) {
    status = `Winner: ${lastMove.winner!.symbol}`;
  } else if (isOutOfMove) {
    status = `Out of moves!`;
  } else {
    status = `Next player: ${getNextSymbol()}`;
  }
  const historyMoves = histories.map((history, index) => {
    const isFirstMove = index === 0;
    const isCurrentMove = index === moveNumber;
    const historyMoveSymbol = isFirstMove ? null : getSymbol(index - 1);
    const historyMoveBoardColumn = (history.lastSquare! % 3) + 1;
    const historyMoveBoardRow = Math.trunc(history.lastSquare! / 3) + 1;
    const description = isFirstMove
      ? `Go to game start`
      : `Go to move # ${index}: ${historyMoveSymbol} (${historyMoveBoardColumn}, ${historyMoveBoardRow})`;

    return (
      <li key={index}>
        <button
          className={isCurrentMove ? "is-current" : ""}
          onClick={() => onClickHistory(index)}
        >
          {description}
        </button>
      </li>
    );
  });
  const sortedMoves = isAscendingHistory
    ? historyMoves
    : historyMoves.reverse();

  return (
    <div className="game">
      <div className={`game-board ${gameEndedClass} ${outOfMoveClass}`}>
        <Board
          {...lastMove}
          onClick={onClickSquare}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>
          <span>
            History Sort: {isAscendingHistory ? "Ascending" : "Descending"}
          </span>
          <span>&nbsp;</span>
          <button onClick={onClickHistorySortToggle}>Toggle</button>
        </div>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
};
