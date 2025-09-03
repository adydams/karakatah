type SpinnerProp = {
  size: string;
};

export default function Spinner({ size }: SpinnerProp) {
  return (
    <span className={`${size === "big" ? "bigloader" : "smallLoader"}`}></span>
  );
}
