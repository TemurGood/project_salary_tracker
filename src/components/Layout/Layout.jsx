// src/components/Layout/Layout.jsx
import React from 'react';
import Header from '../Header/Header.jsx';
import styles from './Layout.module.css';

function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;