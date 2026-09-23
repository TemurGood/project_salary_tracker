// src/components/TransactionForm/TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import styles from './TransactionForm.module.css';

// Fallback-категории — будут заменены на импорт из constants.js в фазе F
const FALLBACK_INCOME_CATEGORIES = [
  { id: 'salary', label: 'Зарплата' },
  { id: 'freelance', label: 'Подработка' },
  { id: 'bonus', label: 'Премия' },
  { id: 'other', label: 'Прочее' },
];

const FALLBACK_EXPENSE_CATEGORIES = [
  { id: 'groceries', label: 'Продукты' },
  { id: 'utilities', label: 'Коммуналка' },
  { id: 'rent', label: 'Аренда' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'other', label: 'Прочее' },
];

function TransactionForm({ onSubmit, onCancel, editData }) {
  // Начальные значения формы
  const [formData, setFormData] = useState({
    type: editData?.type || 'expense',
    category: editData?.category || '',
    amount: editData?.amount || '',
    date: editData?.date || new Date().toISOString().split('T')[0],
    comment: editData?.comment || '',
  });

  // Если editData изменился — обновляем форму
  useEffect(() => {
    if (editData) {
      setFormData({
        type: editData.type || 'expense',
        category: editData.category || '',
        amount: editData.amount || '',
        date: editData.date || new Date().toISOString().split('T')[0],
        comment: editData.comment || '',
      });
    }
  }, [editData]);

  // При смене типа сбрасываем категорию, если она не из нового списка
  useEffect(() => {
    const categories = formData.type === 'income'
      ? FALLBACK_INCOME_CATEGORIES
      : FALLBACK_EXPENSE_CATEGORIES;
    
    const isValidCategory = categories.some((c) => c.id === formData.category);
    if (!isValidCategory && categories.length > 0) {
      setFormData((prev) => ({ ...prev, category: categories[0].id }));
    }
  }, [formData.type, formData.category]);

  const currentCategories = formData.type === 'income'
    ? FALLBACK_INCOME_CATEGORIES
    : FALLBACK_EXPENSE_CATEGORIES;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Базовая валидация
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Введите корректную сумму');
      return;
    }
    if (!formData.category) {
      alert('Выберите категорию');
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  const isEditMode = Boolean(editData);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Переключатель типа */}
      <div className={styles.typeSwitcher}>
        <button
          type="button"
          className={`${styles.typeButton} ${
            formData.type === 'income' ? styles.typeButtonActiveIncome : ''
          }`}
          onClick={() => handleChange('type', 'income')}
        >
          <span>💰</span>
          <span>Доход</span>
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${
            formData.type === 'expense' ? styles.typeButtonActiveExpense : ''
          }`}
          onClick={() => handleChange('type', 'expense')}
        >
          <span>💸</span>
          <span>Расход</span>
        </button>
      </div>

      {/* Сумма и дата */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Сумма (₽)</label>
          <input
            type="number"
            className={styles.input}
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Дата</label>
          <input
            type="date"
            className={styles.input}
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Категория */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Категория</label>
        <select
          className={styles.select}
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          required
        >
          <option value="">Выберите категорию</option>
          {currentCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Комментарий */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Комментарий</label>
        <textarea
          className={styles.textarea}
          value={formData.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
          placeholder="Необязательное примечание"
          rows="3"
        />
      </div>

      {/* Кнопки действий */}
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={onCancel}
        >
          Отмена
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {isEditMode ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;