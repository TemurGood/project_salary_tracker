import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/project_salary_tracker/', // <-- ВАЖНО: точное имя репозитория со слэшами
})