// src/components/BarChart/BarChart.jsx
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Форматирование суммы для подсказки
const formatAmount = (value) => {
  return `${(value ?? 0).toLocaleString('ru-RU')} ₽`;
};

function BarChart({ data = [], title }) {
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
          📈
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
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>
            {label}
          </div>
          {payload.map((item, index) => (
            <div key={index} style={{ 
              color: item.color, 
              fontSize: 'var(--font-size-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 'var(--spacing-md)',
            }}>
              <span>{item.name}:</span>
              <span style={{ fontWeight: 600 }}>{formatAmount(item.value)}</span>
            </div>
          ))}
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
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="month" 
            stroke="var(--color-text-secondary)"
            style={{ fontSize: 'var(--font-size-sm)' }}
          />
          <YAxis 
            stroke="var(--color-text-secondary)"
            style={{ fontSize: 'var(--font-size-sm)' }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: 'var(--font-size-sm)' }}
          />
          <Bar 
            dataKey="income" 
            name="Доходы" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="expense" 
            name="Расходы" 
            fill="#ef4444" 
            radius={[8, 8, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;