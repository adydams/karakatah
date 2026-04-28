import { createContext, type ReactNode } from "react";

type ModalContextType = {
  showModal: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode | null;
};

export const ModalContext = createContext<ModalContextType | null>(null);
