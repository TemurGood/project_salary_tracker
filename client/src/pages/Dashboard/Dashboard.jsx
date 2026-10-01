// client/src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import BalanceCard from "../../components/BalanceCard/BalanceCard.jsx";
import TransactionList from "../../components/TransactionList/TransactionList.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import TransactionForm from "../../components/TransactionForm/TransactionForm.jsx";
import { addIncome } from "../../services/incomeService.js";
import { addExpense } from "../../services/expenseService.js";
import {
  getBalance,
  getRecentTransactions,
} from "../../services/summaryService.js";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [balance, setBalance] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Ждём получения баланса (добавлен await)
      const balanceData = await getBalance();
      setBalance(
        balanceData || { totalIncome: 0, totalExpense: 0, balance: 0 },
      );

      // 2. Ждём получения последних операций (добавлен await)
      const recent = await getRecentTransactions(5);
      setRecentTransactions(recent || []);
    } catch (error) {
      console.error("❌ Ошибка загрузки данных Dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      // 1. Ждём завершения сохранения на сервере (добавлен await)
      if (formData.type === "income") {
        await addIncome(formData);
      } else {
        await addExpense(formData);
      }

      // 2. Закрываем модалку и перезагружаем данные ТОЛЬКО после успешного сохранения
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error("❌ Ошибка при сохранении операции:", error);
      alert("Не удалось сохранить операцию. Проверьте консоль (F12).");
    }
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
  };

  // Показываем индикатор загрузки, пока данные идут с сервера
  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <h2>Загрузка данных...</h2>
      </div>
    );
  }

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
        <BalanceCard title="Баланс" amount={balance.balance} type="balance" />
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
