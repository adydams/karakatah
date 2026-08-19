import React, { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
};

export default function Modal({ isOpen, onClose, children, ariaLabel }: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const el = modalRef.current;
    const focusableSelector =
      'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';

    function focusFirst() {
      if (!el) return;
      const list = Array.from(el.querySelectorAll<HTMLElement>(focusableSelector));
      if (list.length) {
        list[0].focus();
      } else {
        el.focus();
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!el) return;
        const focusable = Array.from(el.querySelectorAll<HTMLElement>(focusableSelector)).filter(
          (f) => f.offsetParent !== null,
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    // Slight delay to ensure elements are mounted
    const t = setTimeout(focusFirst, 0);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onMouseDown={onClose}
        aria-hidden
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || "Dialog"}
        tabIndex={-1}
        className="relative z-10 max-h-[90vh] w-[92%] max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
