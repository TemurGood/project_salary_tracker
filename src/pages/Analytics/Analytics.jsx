// src/pages/Analytics/Analytics.jsx
import React, { useState, useEffect } from 'react';
import PieChart from '../../components/PieChart/PieChart.jsx';
import BarChart from '../../components/BarChart/BarChart.jsx';
import { getByCategory, getMonthlySummary } from '../../services/summaryService.js';
import styles from './Analytics.module.css';

function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Получаем данные по категориям для круговой диаграммы
    const categoryStats = getByCategory('expense', 'all');
    setCategoryData(categoryStats);

    // Получаем месячную сводку для столбчатого графика
    const monthlyStats = getMonthlySummary(new Date().getFullYear());
    setMonthlyData(monthlyStats);
  };

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