# 🎧 Plataforma Musical - Frontend + Backend

Aquest projecte és una plataforma musical web amb funcionalitats socials. Està dividit en dues parts:

- 🎨 **Frontend:** Desenvolupat amb React + Vite per oferir una interfície moderna i interactiva als usuaris.
- 🔧 **Backend:** Desenvolupat amb Laravel, proporciona una API REST per gestionar usuaris, cançons, àlbums, puntuacions, etc.

---

## 🧱 Estructura del projecte

```plaintext
/
├── frontend/       # Interfície d'usuari (React + Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/     # Peticions a la API
│       └── assets/
│
├── backend/        # Backend (Laravel)
│   ├── app/        # Lògica d’aplicació (Models, Controllers)
│   ├── routes/
│   ├── database/   # Migracions, seeders
│   └── config/
│
└── README.md       # Documentació general del projecte