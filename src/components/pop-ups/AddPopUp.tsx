import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 rounded-md">
     <div className="absolute w-screen inset-0  bg-black opacity-60 rounded-md   " ></div>
      <div className="relative   border border-gray-400 shadow-lg  rounded-md ">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;