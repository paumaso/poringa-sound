
---

## ✅ `backend/README.md`

```markdown
# 🎧 Backend - Plataforma Musical

Aquest és el backend de la plataforma musical, desenvolupat amb **Laravel**.

---

## 🚀 Tecnologies

- PHP 8.1+
- Laravel 11
- MySQL / SQLite
- Composer

---

## 📦 Requisits

- PHP >= 8.1
- Composer
- Base de dades (MySQL recomanat)

---

## 🛠️ Instal·lació

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

Configura .env

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=musica
DB_USERNAME=root
DB_PASSWORD=

---

## 🚀 Ejecucion
php artisan serve