import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";

const Square = (props) => {
  const isHighlightClass = props.isHighlight ? "is-highlight" : "";

  return (
    <div
      className={`square ${isHighlightClass}`}
      onClick={() => props.onClick()}
    >
      {props.value}
    </div>
  );
};

const Board = (props) => {
  const renderSquare = (i) => {
    const isWinningSquare =
      props.winner?.lines.some((value) => value === i) ?? false;

    return (
      <Square
        key={i}
        value={props.squares[i]}
        isHighlight={isWinningSquare}
        onClick={() => props.onClick(i)}
      />
    );
  };

  const renderBoard = () => {
    const board = Array(3)
      .fill(null)
      .map((outerValue, outerIndex) => {
        return Array(3)
          .fill(null)
          .map((innerValue, innerIndex) => {
            const squareIndex = outerIndex * 3 + innerIndex;
            return renderSquare(squareIndex);
          });
      });
    return board;
  };

  return <>{renderBoard()}</>;
};

const Game = (props) => {
  const maximumMoves = 9;
  const [histories, setHistories] = useState([
    {
      squares: Array(9).fill(null),
      lastSquare: null,
      winner: null,
    },
  ]);
  const [moveNumber, setMoveNumber] = useState(0);
  const [isAscendingHistory, setIsAscendingHistory] = useState(true);

  const getSymbol = (currentMoveNumber) => {
    return currentMoveNumber % 2 === 0 ? "X" : "O";
  };

  const getNextSymbol = () => {
    return getSymbol(moveNumber);
  };

  const calculateWinner = (squares) => {
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
          symbol: squares[a],
          lines: lines[i],
        };
      }
    }
    return null;
  };

  const onClickHistory = (moveNumber) => {
    setMoveNumber(moveNumber);
  };

  const onClickHistorySortToggle = () => {
    setIsAscendingHistory(!isAscendingHistory);
  };

  const onClickSquare = (i) => {
    // current history may defers if user "time travel" to past moves
    const activeHistories = histories.slice(0, moveNumber + 1);
    const lastActiveMove = activeHistories[activeHistories.length - 1];

    const isSquareFilled = !!lastActiveMove.squares[i];
    if (isSquareFilled) return;
    const hasWinner = !!lastActiveMove.winner;
    if (hasWinner) return;

    const squares = [...lastActiveMove.squares];
    squares[i] = getNextSymbol();
    const winner = calculateWinner(squares);
    setHistories([
      ...activeHistories,
      {
        squares: squares,
        lastSquare: i,
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
    status = `Winner: ${lastMove.winner.symbol}`;
  } else if (isOutOfMove) {
    status = `Out of moves!`;
  } else {
    status = `Next player: ${getNextSymbol()}`;
  }
  const historyMoves = histories.map((history, index) => {
    const isFirstMove = index === 0;
    const isCurrentMove = index === moveNumber;
    const historyMoveSymbol = isFirstMove ? null : getSymbol(index - 1);
    const historyMoveBoardColumn = (history.lastSquare % 3) + 1;
    const historyMoveBoardRow = Math.trunc(history.lastSquare / 3) + 1;
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
          onClick={(i) => onClickSquare(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>
          <span>
            History Sort: {isAscendingHistory ? "Ascending" : "Descending"}
          </span>
          <span>&nbsp;</span>
          <button onClick={() => onClickHistorySortToggle()}>Toggle</button>
        </div>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
};

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);
