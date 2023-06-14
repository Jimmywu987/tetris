import { GRID_COLORS } from "constants/gridColors";
import { useMemo } from "react";
import { Puzzle } from "types";
import { cn } from "utils/cn";

export const NextPuzzleDisplay = ({
  storePuzzle,
  className,
}: {
  storePuzzle: Puzzle[];
  className: string;
}) => {
  const displayNextPuzzle = useMemo(
    () =>
      new Array(24)
        .fill(0)
        .map((_, index) =>
          storePuzzle.length !== 0 &&
          storePuzzle[0].shape
            .map((position) => (position > 10 ? position : position + 4))
            .includes(index)
            ? storePuzzle[0].puzzleNum
            : 0
        ),
    [storePuzzle]
  );
  return (
    <div className={className}>
      {displayNextPuzzle.map((gridNum, index) => (
        <div
          key={index}
          className={cn(
            "border border-gray-300 w-5 h-5 md:w-9 md:h-9",
            GRID_COLORS[gridNum]
          )}
        />
      ))}
    </div>
  );
};
