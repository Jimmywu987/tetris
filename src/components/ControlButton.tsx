export const ControlButton = ({
  onClick,
  controlKey,
}: {
  onClick: () => void;
  controlKey: string;
}) => {
  return (
    <button
      className="px-5 py-1 border-2 text-3xl focus:bg-gray-100 rounded-lg"
      onClick={onClick}
    >
      {controlKey}
    </button>
  );
};
