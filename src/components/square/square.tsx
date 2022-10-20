import { OnClickSquare } from "../game/game";
import "./square.scss";

type SquareProp = {
  index: number;
  value: string;
  isHighlight: boolean;
  onClick: OnClickSquare;
};

export const Square = (props: SquareProp) => {
  const isHighlightClass = props.isHighlight ? "is-highlight" : "";

  return (
    <div
      className={`square ${isHighlightClass}`}
      onClick={() => props.onClick(props.index)}
    >
      {props.value}
    </div>
  );
};
