// src/components/EmptyState/EmptyState.jsx
import React from 'react';
import styles from './EmptyState.module.css';

function EmptyState({
  title = 'Нет данных',
  description,
  actionLabel,
  onAction,
  icon = '📭',
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
      {actionLabel && onAction && (
        <button className={styles.actionButton} onClick={onAction}>
          <span>+</span>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;