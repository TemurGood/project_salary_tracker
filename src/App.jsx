// src/App.jsx
import Analytics from './pages/Analytics/Analytics.jsx';
import History from './pages/History/History.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Layout from './components/Layout/Layout.jsx';
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import styles from './App.module.css';
import Header from './components/Header/Header.jsx';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;