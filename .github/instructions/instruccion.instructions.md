applyTo: '**'
---
# Project context
- Fullstack app with Node.js/Express backend, Sequelize + SQLite DB.
- Frontend is SPA in plain HTML, CSS, JS, organized by features.
- Backend follows MVC: models, controllers, routes, database.
- Frontend communicates via fetch() to API endpoints.
- All static files served from frontend/src.
- Environment variables managed via .env

# Coding guidelines
- Prefer modular, readable, maintainable code.
- Use async/await for async operations in backend.
- Keep frontend SPA pattern consistent.
- Follow feature-based organization.
- Use sessionStorage for session data, not localStorage.
- All backend responses in JSON; frontend renders dynamically.
- Passwords encrypted with bcrypt.
