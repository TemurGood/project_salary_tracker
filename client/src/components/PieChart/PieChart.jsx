// src/components/PieChart/PieChart.jsx
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Цветовая палитра для секторов
const COLORS = [
  '#4f46e5', // primary
  '#10b981', // success
  '#f59e0b', // warning
  '#ef4444', // danger
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#f97316', // orange
  '#14b8a6', // teal
];

// Форматирование суммы для подсказки
const formatAmount = (value) => {
  return `${(value ?? 0).toLocaleString('ru-RU')} ₽`;
};

function PieChart({ data = [], title }) {
  // Если данных нет — показываем заглушку
  if (!data || data.length === 0) {
    return (
      <div style={{
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}>
          📊
        </div>
        <div style={{ fontSize: 'var(--font-size-base)' }}>
          Нет данных для отображения
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
          Добавьте операции, чтобы увидеть график
        </div>
      </div>
    );
  }

  // Кастомная подсказка
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
            {item.name}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            {formatAmount(item.value)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {title && (
        <div style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: 'var(--spacing-md)',
        }}>
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: 'var(--font-size-sm)' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;