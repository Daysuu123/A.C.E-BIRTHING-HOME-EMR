# Laravel backend scaffold for A.C.E Birthing Home

This folder includes the minimal files you need to wire your React app to a Laravel backend. Create a Laravel app locally, then copy each file to the matching path in that app.

Steps

1) Create Laravel app
- Install Composer (if not installed)
- In a terminal:
  - composer create-project laravel/laravel ace-api
  - cd ace-api
  - php artisan serve (Laravel runs at http://127.0.0.1:8000)

2) Configure CORS for Vite
- Edit ace-api/config/cors.php
  - Ensure `paths` contains `api/*`
  - If needed, set `allowed_origins` to include `http://localhost:5173`
- Run: php artisan config:clear

3) Configure mail in .env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=yourgmail@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=yourgmail@gmail.com
MAIL_FROM_NAME="A.C.E Birthing Home"

4) Database setup
- Create a database (MySQL/MariaDB) e.g. `ace_db`
- In ace-api/.env set:
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=ace_db
  DB_USERNAME=your_db_user
  DB_PASSWORD=your_db_password
- Run migrations to create the `users` table:
  php artisan migrate

5) Copy these scaffold files into your Laravel app
- backend-laravel/routes/api.php → ace-api/routes/api.php (merge with existing)
- backend-laravel/app/Http/Controllers/AuthController.php → ace-api/app/Http/Controllers/AuthController.php
- backend-laravel/app/Mail/CodeMail.php → ace-api/app/Mail/CodeMail.php
- backend-laravel/resources/views/emails/code.blade.php → ace-api/resources/views/emails/code.blade.php

6) Endpoints
- POST /api/login { email, password }
- POST /api/register { name, email, password }

7) Test endpoints
- curl -X POST http://127.0.0.1:8000/api/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","password":"12345678"}'
- curl -X POST http://127.0.0.1:8000/api/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"12345678"}'

Your React app is already set to call /api/login; for signup UI, post to /api/register.
