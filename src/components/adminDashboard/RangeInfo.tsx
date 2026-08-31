import React from "react";

type RangeInfoProps = {
  title: string;
  percent: string;
  color: string;
};

export default function RangeInfo({ title, percent, color }: RangeInfoProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-700">{title}</span>
        <span className="font-bold text-gray-900">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}
