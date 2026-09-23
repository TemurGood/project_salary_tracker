// src/pages/History/History.jsx
import React, { useState, useEffect } from 'react';
import TransactionList from '../../components/TransactionList/TransactionList.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import TransactionForm from '../../components/TransactionForm/TransactionForm.jsx';
import { addIncome, updateIncome, deleteIncome, getIncomes } from '../../services/incomeService.js';
import { addExpense, updateExpense, deleteExpense, getExpenses } from '../../services/expenseService.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, getCategoryLabel } from '../../utils/constants.js';
import styles from './History.module.css';

function History() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    period: 'all',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Загрузка данных при монтировании и при изменении фильтров
  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = () => {
    const incomes = getIncomes().map((i) => ({
      ...i,
      categoryLabel: getCategoryLabel(i.category, 'income'),
    }));
    const expenses = getExpenses().map((e) => ({
      ...e,
      categoryLabel: getCategoryLabel(e.category, 'expense'),
    }));

    // Объединяем все операции
    let allTransactions = [...incomes, ...expenses];

    // Применяем фильтры
    allTransactions = applyFilters(allTransactions, filters);

    // Сортировка по дате (новые первые)
    allTransactions.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    setTransactions(allTransactions);
  };

  const applyFilters = (items, filtersObj) => {
    let filtered = items;

    // Фильтр по типу
    if (filtersObj.type !== 'all') {
      filtered = filtered.filter((item) => item.type === filtersObj.type);
    }

    // Фильтр по категории
    if (filtersObj.category !== 'all') {
      filtered = filtered.filter((item) => item.category === filtersObj.category);
    }

    // Фильтр по периоду
    if (filtersObj.period !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        
        switch (filtersObj.period) {
          case 'today':
            return itemDate >= today;
          case 'week': {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return itemDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return itemDate >= monthAgo;
          }
          case 'year': {
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return itemDate >= yearAgo;
          }
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту операцию?')) {
      return;
    }

    // Определяем тип и удаляем из соответствующего сервиса
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      if (transaction.type === 'income') {
        deleteIncome(id);
      } else {
        deleteExpense(id);
      }
      loadTransactions();
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingTransaction) {
      // Режим редактирования
      if (editingTransaction.type === 'income') {
        updateIncome(editingTransaction.id, formData);
      } else {
        updateExpense(editingTransaction.id, formData);
      }
    } else {
      // Режим добавления
      if (formData.type === 'income') {
        addIncome(formData);
      } else {
        addExpense(formData);
      }
    }

    setIsModalOpen(false);
    setEditingTransaction(null);
    loadTransactions();
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Получаем список категорий для фильтра на основе выбранного типа
  const getAvailableCategories = () => {
    if (filters.type === 'income') {
      return INCOME_CATEGORIES;
    } else if (filters.type === 'expense') {
      return EXPENSE_CATEGORIES;
    } else {
      // Если тип "все", показываем все категории
      return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
    }
  };

  return (
    <div className={styles.history}>
      <div className={styles.header}>
        <h1 className={styles.title}>История операций</h1>
        <button className={styles.addButton} onClick={handleAddTransaction}>
          <span>+</span>
          <span>Добавить операцию</span>
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterSelect}
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterSelect}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">Все категории</option>
            {getAvailableCategories().map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Период</label>
          <select
            className={styles.filterSelect}
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
          >
            <option value="all">Всё время</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
        </div>
      </div>

      <div className={styles.listSection}>
        <h2 className={styles.listTitle}>Все операции</h2>
        <TransactionList
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {/* Модальное окно с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingTransaction ? 'Редактировать операцию' : 'Добавить операцию'}
      >
        <TransactionForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          editData={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default History;