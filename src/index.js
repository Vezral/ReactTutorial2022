import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const Square = (props) => {
  const isHighlightClass = props.isHighlight ? "is-highlight" : "";

  return (
    <button
      className={`square ${isHighlightClass}`}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
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
        return (
          <div
            key={`outer ${outerIndex}`}
            className="board-row"
          >
            {Array(3)
              .fill(null)
              .map((innerValue, innerIndex) => {
                const squareIndex = outerIndex * 3 + innerIndex;
                return renderSquare(squareIndex);
              })}
          </div>
        );
      });
    return board;
  };

  return <div>{renderBoard()}</div>;
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastSquare: null,
          winner: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isAscendingHistory: true,
    };
  }

  getSymbol(stepNumber) {
    return stepNumber % 2 === 0 ? "X" : "O";
  }

  getNextSymbol() {
    return this.state.xIsNext ? "X" : "O";
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    const isSquareFilled = !!current.squares[i];
    if (isSquareFilled) return;
    const hasWinner = !!current.winner;
    if (hasWinner) return;

    const squares = current.squares.slice();
    squares[i] = this.getNextSymbol();
    const winner = calculateWinner(squares);
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastSquare: i,
          winner: winner,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: this.getSymbol(step) === "X",
    });
  }

  toggleIsAscendingHistory() {
    this.setState({
      isAscendingHistory: !this.state.isAscendingHistory,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const hasWinner = !!current.winner;
    const isOutOfMove = this.state.stepNumber === 9;
    const outOfMoveClass = !hasWinner && isOutOfMove ? "out-of-move" : "";
    let status;
    if (hasWinner) {
      status = `Winner: ${current.winner.symbol}`;
    } else if (isOutOfMove) {
      status = `Out of moves!`;
    } else {
      status = `Next player: ${this.getNextSymbol()}`;
    }
    const moves = history.map((step, move) => {
      const isFirstMove = move === 0;
      const isCurrentMove = move === this.state.stepNumber;
      const lastSquareSymbol = isFirstMove ? null : this.getSymbol(move - 1);
      const lastSquareColumn = (step.lastSquare % 3) + 1;
      const lastSquareRow = Math.trunc(step.lastSquare / 3) + 1;
      const description = isFirstMove
        ? `Go to game start`
        : `Go to move # ${move}: ${lastSquareSymbol} (${lastSquareColumn}, ${lastSquareRow})`;

      return (
        <li key={move}>
          <button
            className={isCurrentMove ? "is-current" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {description}
          </button>
        </li>
      );
    });
    const sortedMoves = this.state.isAscendingHistory ? moves : moves.reverse();

    return (
      <React.StrictMode>
        <div className="game">
          <div className={`game-board ${outOfMoveClass}`}>
            <Board
              {...current}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div>
              <span>
                History Sort:{" "}
                {this.state.isAscendingHistory ? "Ascending" : "Descending"}
              </span>
              <span>&nbsp;</span>
              <button onClick={() => this.toggleIsAscendingHistory()}>
                Toggle
              </button>
            </div>
            <ol>{sortedMoves}</ol>
          </div>
        </div>
      </React.StrictMode>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        symbol: squares[a],
        lines: lines[i],
      };
    }
  }
  return null;
}
