// Accessible generic modal overlay wrapper with backdrop-dismiss support.
import React from 'react';

export default function Modal({
  isOpen,
  onClose,
  children,
  dialogClassName = 'modal-box',
  id,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal"
      id={id}
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className={dialogClassName}>
        {children}
      </div>
    </div>
  );
}
