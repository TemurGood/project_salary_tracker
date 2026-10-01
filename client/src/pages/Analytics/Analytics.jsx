// client/src/pages/Analytics/Analytics.jsx
import React, { useState, useEffect } from "react";
import PieChart from "../../components/PieChart/PieChart.jsx";
import BarChart from "../../components/BarChart/BarChart.jsx";
// ИСПРАВЛЕНИЕ 1: Правильные имена импортируемых функций
import { getByCategory, getByMonth } from "../../services/summaryService.js";
import styles from "./Analytics.module.css";

function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // ИСПРАВЛЕНИЕ 2: Добавлен await и правильные вызовы без аргументов
      const categoryStats = await getByCategory();

      // Преобразуем данные расходов в формат, удобный для PieChart (name, value)
      // Бэкенд возвращает { category: 'groceries', total: 5000, count: 2 }
      const formattedCategoryData = (categoryStats.expenses || []).map(
        (item) => ({
          name: item.category, // ID категории (например, 'groceries')
          value: item.total, // Сумма
        }),
      );
      setCategoryData(formattedCategoryData);

      // Получаем месячную сводку
      const monthlyStats = await getByMonth();

      // ИСПРАВЛЕНИЕ 3: Объединяем доходы и расходы по месяцам для BarChart
      // Бэкенд возвращает { incomes: [{month, total}], expenses: [{month, total}] }
      // Нам нужно получить массив вида: [{ month: '2023-10', income: 100, expense: 50 }]
      const allMonths = new Set([
        ...(monthlyStats.incomes || []).map((i) => i.month),
        ...(monthlyStats.expenses || []).map((e) => e.month),
      ]);

      const formattedMonthlyData = Array.from(allMonths)
        .sort()
        .map((month) => {
          const incomeObj = (monthlyStats.incomes || []).find(
            (i) => i.month === month,
          );
          const expenseObj = (monthlyStats.expenses || []).find(
            (e) => e.month === month,
          );

          return {
            month: month,
            income: incomeObj ? incomeObj.total : 0,
            expense: expenseObj ? expenseObj.total : 0,
          };
        });

      setMonthlyData(formattedMonthlyData);
    } catch (error) {
      console.error("❌ Ошибка загрузки данных аналитики:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className={styles.analytics}>
        <h2>Загрузка аналитики...</h2>
      </div>
    );
  }

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <h1 className={styles.title}>Аналитика</h1>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <PieChart data={categoryData} title="Расходы по категориям" />
        </div>

        <div className={styles.chartCard}>
          <BarChart data={monthlyData} title="Доходы и расходы по месяцам" />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
