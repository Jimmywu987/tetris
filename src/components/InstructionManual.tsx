const Instruction = ({
  controlKey,
  instructionText,
}: {
  controlKey: string;
  instructionText: string;
}) => {
  return (
    <p>
      <span className="font-bold text-lg">{controlKey}:</span> {instructionText}
    </p>
  );
};

export const InstructionManual = () => {
  return (
    <div className="space-y-2 md:mt-3 ">
      <p className="md:ml-2 md:text-2xl font-bold">Control:</p>
      <Instruction controlKey="w" instructionText="turn the puzzle clockwise" />
      <Instruction
        controlKey="a"
        instructionText="move the puzzle to the
      left"
      />
      <Instruction
        controlKey="d"
        instructionText="move the puzzle to the right"
      />
      <Instruction controlKey="s" instructionText="move the puzzle downward" />
      <Instruction
        controlKey="x"
        instructionText="push the puzzle to the bottom"
      />
    </div>
  );
};
