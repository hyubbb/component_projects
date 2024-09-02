export const Blank = ({ height }: { height: number }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: `${height}px`,
      }}
    >
      여백
    </div>
  );
};
