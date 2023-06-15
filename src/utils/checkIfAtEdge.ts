export const checkIsAtEdge = (puzzle: number[]): boolean => {
  const checkPuzzleRelativePositionWithEdge = puzzle.map((e) => e % 10);
  const toRightEdge = Math.max(...checkPuzzleRelativePositionWithEdge);
  const toLeftEdge = Math.min(...checkPuzzleRelativePositionWithEdge);
  // check if the puzzle is at the edge
  return 4 > toRightEdge - toLeftEdge && toLeftEdge - 1 >= -1;
};
