# Инструкция по развёртыванию Salary Tracker

В проекте настроена поддержка:
1. **Базы данных Turso (libSQL)** — бессерверный SQLite в облаке.
2. **Деплоя на Vercel** — единый проект (Frontend на React/Vite + Backend на Express в виде Serverless Functions).

---

## Шаг 1. Создание базы данных в Turso

### Вариант A: Через веб-интерфейс (быстро и без установки CLI)
1. Перейдите на [turso.tech](https://turso.tech) и войдите (Sign In через GitHub).
2. Нажмите **Create Database**, укажите имя базы (например: `salary-tracker`).
3. Скопируйте полученный **Database URL** (вид: `libsql://salary-tracker-[username].turso.io`).
4. В разделе базы данных нажмите **Generate Token** / **Create Token** и сохраните токен.

### Вариант B: Через Turso CLI
```powershell
# Установка Turso CLI в Windows PowerShell:
irm https://get.tur.so/install.ps1 | iex

# Авторизация:
turso auth login

# Создание базы:
turso db create salary-tracker

# Получение URL:
turso db show salary-tracker --url

# Создание токена доступа:
turso db tokens create salary-tracker
```

---

## Шаг 2. Перенос (миграция) локальных данных в Turso

В проекте уже есть локальная база `database.sqlite` (с пользователями и записями). Чтобы автоматически создать таблицы и загрузить данные в Turso:

1. Создайте файл `server/.env` (или заполните переменные):
```env
TURSO_DATABASE_URL=libsql://salary-tracker-[username].turso.io
TURSO_AUTH_TOKEN=ваш-токен-от-turso
JWT_SECRET=super-secret-key-for-salary-tracker
```

2. Запустите скрипт проверки связи:
```powershell
npm run turso:test
```

3. Запустите миграцию существующих данных:
```powershell
npm run turso:migrate
```
Скрипт автоматически создаст таблицы `users`, `incomes`, `expenses` и перенесёт все данные из локального файла в Turso.

---

## Шаг 3. Деплой на Vercel

### 1. Отправьте изменения в GitHub:
```powershell
git add .
git commit -m "Configure Turso database and Vercel serverless deployment"
git push origin main
```

### 2. Подключение репозитория в Vercel:
1. Зайдите на [vercel.com](https://vercel.com) и нажмите **Add New...** -> **Project**.
2. Выберите ваш репозиторий `project_salary_tracker`.
3. В настройках проекта:
   - **Framework Preset**: Vite (или Other, настройки уже в `vercel.json`).
   - **Root Directory**: `./` (оставьте корень).
4. Разверните блок **Environment Variables** и добавьте:
   - `TURSO_DATABASE_URL` — ваш URL базы Turso (`libsql://...`).
   - `TURSO_AUTH_TOKEN` — токен Turso.
   - `JWT_SECRET` — любая надёжная случайная строка для подписи токенов.
   - `CORS_ORIGIN` — `*` (или оставьте пустым).
5. Нажмите **Deploy**.

После завершения сборки Vercel выдаст ссылку (например, `https://project-salary-tracker-xxxx.vercel.app`), где будут одновременно работать и клиент, и API.
