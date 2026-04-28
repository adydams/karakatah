import { useModal } from "../../contexts/hooks/useModal";

type ModalDeleteType = {
  itemId: string;
  itemTitle: string;
  type: string;
  // itemAction: () => void
};

export function ModalDelete({ itemId, itemTitle, type }: ModalDeleteType) {
  const { closeModal } = useModal();

  function handleDelete() {
    console.log("Deleting product:", itemId);
    closeModal();
  }

  console.log(itemId, itemTitle, type);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col items-center justify-center gap-5 rounded-2xl bg-gray-50 px-8 py-8 text-xs shadow-sm md:px-10 md:text-sm"
    >
      <img
        src="images/thrash.svg"
        className="w-[80px] md:w-[150px]"
        alt="Thrash image"
      />
      <h1 className="max-w-[80%] text-center font-semibold">
        Are you sure you want to delete this {type}?
      </h1>
      <p className="font-secondary font-light">{itemTitle}</p>
      <div className="flex w-full grid-cols-1 items-center justify-center gap-5 md:grid-cols-2">
        <button
          onClick={closeModal}
          className="w-full cursor-pointer rounded-lg border border-black/30 py-2 text-black/70"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="w-full cursor-pointer rounded-lg border bg-red-500 py-2 font-semibold text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
