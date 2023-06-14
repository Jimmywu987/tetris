export const getNewPuzzlePosition = (puzzle: number[]) => {
  const isInNewPosition = [];
  const oneGridDownPuzzle = puzzle.map((position) => position + 10);

  for (let i = 0; i < oneGridDownPuzzle.length; i++) {
    if (!puzzle.includes(oneGridDownPuzzle[i])) {
      isInNewPosition.push(puzzle[i]);
    }
  }
  return isInNewPosition;
};
