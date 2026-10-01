// src/components/Modal/Modal.jsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, title, children, footer }) {
  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Блокируем скролл body, когда модалка открыта
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Если модалка закрыта — ничего не рендерим
  if (!isOpen) return null;

  // Закрытие по клику на overlay (но не на контент)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Рендерим через портал, чтобы модалка была поверх всего
  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.content}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={() => onClose?.()}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export default Modal;