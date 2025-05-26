# 🎧 Backend - Plataforma Musical

## 🚀 Tecnologies utilitzades

- **PHP 8.1+**
- **Laravel 11**
- **MySQL** o **SQLite**
- **Composer**

---

## 📋 Requisits previs

Abans d'iniciar, assegura't de tenir instal·lat:

- PHP >= 8.1
- Composer
- Un servidor de base de dades (MySQL recomanat)

---

## ⚙️ Instal·lació

1. Clona el repositori i entra al directori:

```bash
cd PringaSound-WS

composer install

cp .env.example .env
php artisan key:generate

    Configura la connexió a la base de dades al fitxer .env:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=musica
DB_USERNAME=root
DB_PASSWORD=

    Executa les migracions per crear les taules a la base de dades:

php artisan migrate

🚀 Execució

Inicia el servidor de desenvolupament amb:

php artisan serve

El backend estarà disponible a:
➡️ http://127.0.0.1:8000
🧪 Endpoints i funcionalitats

A mesura que desenvolupis els controladors i rutes, afegeix aquí la documentació de la teva API.

    GET /api/cancons – Llista de cançons

    POST /api/register – Registre d’usuari

    POST /api/login – Inici de sessió

    ...

🔐 Autenticació

Aquesta aplicació utilitza Laravel Sanctum / Passport / Token JWT (indica quin si és el cas) per protegir les rutes privades dels usuaris.
🧹 Altres comandes útils

php artisan migrate:fresh --seed 
php artisan db:seed 
php artisan route:list 

📄 Llicència

Projecte acadèmic – ús educatiu.
