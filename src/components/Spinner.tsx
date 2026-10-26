type SpinnerProp = {
  size?: string;
  type?: string;
  color?: string;
};

export default function Spinner({ size, type, color }: SpinnerProp) {
  const actualSize = size || type;
  return (
    <span
      style={{
        color,
        borderTopColor: color,
        borderLeftColor: color,
      }}
      className={`${actualSize === "big" ? "bigloader" : "smallLoader"}`}
    ></span>
  );
}
