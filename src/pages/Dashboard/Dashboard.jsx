// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx';
import TransactionList from '../../components/TransactionList/TransactionList.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import TransactionForm from '../../components/TransactionForm/TransactionForm.jsx';
import { addIncome } from '../../services/incomeService.js';
import { addExpense } from '../../services/expenseService.js';
import { getBalance, getRecentTransactions } from '../../services/summaryService.js';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [balance, setBalance] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Получаем баланс
    const balanceData = getBalance();
    setBalance(balanceData);

    // Получаем последние 5 операций
    const recent = getRecentTransactions(5);
    setRecentTransactions(recent);
  };

  const handleAddTransaction = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    // Добавляем операцию в соответствующий сервис
    if (formData.type === 'income') {
      addIncome(formData);
    } else {
      addExpense(formData);
    }

    setIsModalOpen(false);
    loadData(); // Перезагружаем данные
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Главная</h1>
        <button className={styles.addButton} onClick={handleAddTransaction}>
          <span>+</span>
          <span>Добавить операцию</span>
        </button>
      </div>

      <div className={styles.cardsGrid}>
        <BalanceCard
          title="Доходы"
          amount={balance.totalIncome}
          type="income"
        />
        <BalanceCard
          title="Расходы"
          amount={balance.totalExpense}
          type="expense"
        />
        <BalanceCard
          title="Баланс"
          amount={balance.balance}
          type="balance"
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Последние операции</h2>
        <TransactionList transactions={recentTransactions} />
      </div>

      {/* Модальное окно с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title="Добавить операцию"
      >
        <TransactionForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;