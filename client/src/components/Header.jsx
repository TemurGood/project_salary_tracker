// client/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService.js';
import styles from './Header.module.css';

function Header() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Удаляем токен и данные пользователя
    logout();
    
    // Перенаправляем на страницу входа
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">💰 Salary Tracker</Link>
        </div>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Главная
          </Link>
          <Link to="/history" className={styles.navLink}>
            История
          </Link>
          <Link to="/analytics" className={styles.navLink}>
            Аналитика
          </Link>
        </nav>

        <div className={styles.userSection}>
          {user && (
            <>
              <span className={styles.userName}>
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Выйти
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;