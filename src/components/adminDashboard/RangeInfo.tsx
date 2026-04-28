type RangeInfoProp = {
  title: string;
  percent: string;
  color: string;
};

export default function RangeInfo({ title, percent, color }: RangeInfoProp) {
  return (
    <div className="my-3">
      <h1 className="flex w-full items-center justify-between">
        <span>{title}</span> <span>{percent}%</span>
      </h1>
      <div
        style={{
          backgroundColor: `${color}50`,
        }}
        className="my-1 flex h-1.5 w-full items-center justify-start rounded-full"
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            backgroundColor: color,
            // borderRadius: "50%",
          }}
          className="rounded-full transition-all duration-1000"
        ></div>
      </div>
    </div>
  );
}
