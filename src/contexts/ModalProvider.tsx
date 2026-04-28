import { useState, type ReactNode } from "react";
import { ModalContext } from "./ModalContext";

type ModalProviderProp = {
  children: ReactNode;
};

export function ModalProvider({ children }: ModalProviderProp) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  function openModal(content: ReactNode) {
    setModalContent(content);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModalContent(null);
  }

  return (
    <ModalContext.Provider
      value={{ showModal, openModal, closeModal, modalContent }}
    >
      {children}
    </ModalContext.Provider>
  );
}
