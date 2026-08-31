import React from "react";
import { FaTrash } from "react-icons/fa";

type PreviewItem = {
  id: string;
  kind: "file" | "url";
  url: string;
  name?: string;
  previewUrl?: string;
  sourceIndex: number;
};

type Props = {
  items: PreviewItem[];
  onRemoveFile: (index: number, kind: "file" | "url") => void;
};

export default function ImagePreviewList({ items, onRemoveFile }: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item, index) => (
        <div key={item.id} className="relative w-20 h-20 group">
          <img
            src={item.kind === "url" ? item.url : item.previewUrl}
            className="w-full h-full object-cover rounded-lg border border-slate-200"
            alt={item.name || "Product preview"}
          />
          <button
            type="button"
            onClick={() => onRemoveFile(item.sourceIndex, item.kind)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            title="Remove image"
          >
            <FaTrash size={10} />
          </button>
        </div>
      ))}
    </div>
  );
}
