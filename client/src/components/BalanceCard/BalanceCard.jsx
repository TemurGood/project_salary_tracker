// src/components/BalanceCard/BalanceCard.jsx
import React from 'react';
import styles from './BalanceCard.module.css';

function BalanceCard({ title, amount, type = 'balance' }) {
  // Fallback значение для amount
  const displayAmount = amount ?? 0;
  
  // Форматирование числа с разделителями тысяч
  const formattedAmount = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(displayAmount);

  // Определение классов в зависимости от типа
  const cardClass = `${styles.card} ${
    type === 'income' ? styles.cardIncome :
    type === 'expense' ? styles.cardExpense :
    styles.cardBalance
  }`;

  const amountClass = `${styles.amount} ${
    type === 'income' ? styles.amountIncome :
    type === 'expense' ? styles.amountExpense :
    styles.amountBalance
  }`;

  // Иконка в зависимости от типа
  const icon = type === 'income' ? '💰' : type === 'expense' ? '💸' : '💎';

  return (
    <div className={cardClass}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      <div className={amountClass}>{formattedAmount}</div>
    </div>
  );
}

export default BalanceCard;