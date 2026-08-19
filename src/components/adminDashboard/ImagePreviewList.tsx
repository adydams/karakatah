import { MdOutlineCancel } from "react-icons/md";

type PreviewItem = {
  id: string;
  kind: "file" | "url";
  name?: string;
  previewUrl?: string;
  url?: string;
  sourceIndex?: number;
};

type Props = {
  items: PreviewItem[];
  onRemoveFile?: (index: number, kind: "file" | "url") => void;
};

export default function ImagePreviewList({ items, onRemoveFile }: Props) {
  if (!items.length) return null;

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => (
        <div key={item.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-1">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-slate-100">
            {item.kind === "file" && item.previewUrl ? (
              <img src={item.previewUrl} alt={item.name || "Selected image"} className="h-full w-full object-cover" />
            ) : item.url ? (
              <img src={item.url} alt={item.name || "Product image"} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 px-1">
            <p className="truncate text-xs text-slate-700">{item.name || "Product image"}</p>
            {onRemoveFile ? (
              <button
                type="button"
                onClick={() => onRemoveFile(item.sourceIndex ?? index, item.kind)}
                className="rounded-full bg-slate-100 p-1 text-slate-600 transition hover:bg-slate-200"
                aria-label="Remove image"
              >
                <MdOutlineCancel size={18} />
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
