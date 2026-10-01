// src/components/TransactionList/TransactionList.jsx
import React from 'react';
import EmptyState from '../EmptyState/EmptyState.jsx';
import styles from './TransactionList.module.css';

function TransactionList({ transactions = [], onEdit, onDelete }) {
  // Если операций нет — показываем заглушку
  if (!transactions.length) {
    return (
      <EmptyState
        icon="📋"
        title="Нет операций"
        description="Добавьте первую операцию, чтобы увидеть её здесь"
      />
    );
  }

  // Форматирование даты (временное — позже вынесем в formatters.js)
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  // Форматирование суммы
  const formatAmount = (amount, type) => {
    const value = amount ?? 0;
    const sign = type === 'income' ? '+' : '−';
    return `${sign}${value.toLocaleString('ru-RU')} ₽`;
  };

  return (
    <div className={styles.list}>
      {transactions.map((tx) => {
        const isIncome = tx.type === 'income';
        const typeIcon = isIncome ? '💰' : '💸';
        const typeIconClass = isIncome ? styles.typeIconIncome : styles.typeIconExpense;
        const amountClass = isIncome ? styles.amountIncome : styles.amountExpense;

        return (
          <div key={tx.id} className={styles.item}>
            <div className={`${styles.typeIcon} ${typeIconClass}`}>
              {typeIcon}
            </div>

            <div className={styles.info}>
              <div className={styles.category}>
                {tx.categoryLabel || tx.category || 'Без категории'}
              </div>
              <div className={styles.details}>
                <span className={styles.detail}>📅 {formatDate(tx.date)}</span>
                {tx.comment && (
                  <span className={styles.comment}>💬 {tx.comment}</span>
                )}
              </div>
            </div>

            <div className={`${styles.amount} ${amountClass}`}>
              {formatAmount(tx.amount, tx.type)}
            </div>

            <div className={styles.actions}>
              {onEdit && (
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => onEdit(tx)}
                  aria-label="Редактировать"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete(tx.id)}
                  aria-label="Удалить"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;