// client/src/components/Layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header.jsx'; // 🔥 Добавь эту строку
import styles from './Layout.module.css';

function Layout() {
  return (
    <div className={styles.layout}>
      {/* 🔥 Добавь Header сюда */}
      <Header />
      
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;