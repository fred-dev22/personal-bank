import React from "react";
import "./modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ open, onClose, children }: ModalProps) => {
  return (
    <div className={`modal-backdrop${open ? " open" : ""}`}> 
      <div
        className={`modal-panel${open ? " open" : ""}`}
        tabIndex={-1}
      >
        {children}
      </div>
      {open && <div className="modal-overlay" onClick={onClose} />}
    </div>
  );
}; 