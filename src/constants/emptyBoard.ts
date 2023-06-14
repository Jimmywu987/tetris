import { Grid } from "types";

export const EMPTY_BOARD: Grid[] = new Array(10 * 20).fill({
  puzzleNum: 0,
  isFixed: false,
});
