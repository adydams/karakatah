type SpinnerProp = {
  size: string;
  color?: string;
};

export default function Spinner({ size, color }: SpinnerProp) {
  return (
    <span
      style={{ color }}
      className={`${size === "big" ? "bigloader" : "smallLoader"}`}
    ></span>
  );
}
