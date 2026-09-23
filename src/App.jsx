// src/App.jsx
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'; // <-- ЗАМЕНИЛИ BrowserRouter на HashRouter
import Layout from './components/Layout/Layout.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import History from './pages/History/History.jsx';
import Analytics from './pages/Analytics/Analytics.jsx';
import styles from './App.module.css';

function App() {
  return (
    <HashRouter> {/* <-- ЗАМЕНИЛИ здесь */}
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/history"
          element={
            <Layout>
              <History />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout>
              <Analytics />
            </Layout>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;