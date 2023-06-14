import { Grid } from "types";

export const checkHorizontalLineIsFilled = (horizontalLine: Grid[]): boolean =>
  horizontalLine.every((grid) => grid.puzzleNum !== 0);
