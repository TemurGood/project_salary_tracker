// src/components/Header/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const navItems = [
  { path: '/', label: 'Главная' },
  { path: '/history', label: 'История' },
  { path: '/analytics', label: 'Аналитика' },
];

function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>💰</span>
          <span>Salary Tracker</span>
        </Link>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Header;