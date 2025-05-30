import React from "react";
import "./modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
}

export const Modal = ({ open, onClose, children, width = 500 }: ModalProps) => {
  return (
    <div className={`modal-backdrop${open ? " open" : ""}`}> 
      <div
        className={`modal-panel${open ? " open" : ""}`}
        style={{ width }}
        tabIndex={-1}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        {children}
      </div>
      {open && <div className="modal-overlay" onClick={onClose} />}
    </div>
  );
}; 