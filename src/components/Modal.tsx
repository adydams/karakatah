import { useEffect } from "react";
import { useModal } from "../contexts/hooks/useModal";

export default function Modal() {
  const { showModal, closeModal, modalContent } = useModal();

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }

    if (showModal) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal, closeModal]);

  if (!showModal) return null;

  return (
    <section
      onClick={closeModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        className="w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        {modalContent}
      </div>
    </section>
  );
}
  