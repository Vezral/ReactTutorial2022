import { GameHistory, OnClickSquare } from "../game/game";
import { Square } from "../square/square";
import "./board.scss";

type BoardProp = GameHistory & {
  onClick: OnClickSquare;
};

export const Board = (props: BoardProp): JSX.Element => {
  const renderSquare = (squareIndex: number) => {
    const isWinningSquare =
      props.winner?.lines.some((value) => value === squareIndex) ?? false;

    return (
      <Square
        key={squareIndex}
        index={squareIndex}
        value={props.squares[squareIndex]!}
        isHighlight={isWinningSquare}
        onClick={props.onClick}
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
