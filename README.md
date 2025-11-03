# Los Montoneros TP – Backend + Frontend

## 📖 Descripción

Proyecto integrador de **Programación III**.
Aplicación tipo **autoservicio**, compuesta por:

* **Frontend:** interfaz SPA (Single Page Application) construida con HTML, CSS y JavaScript puro, orientada a *features*.
* **Backend:** servidor **Express + Sequelize + SQLite** que entrega datos en formato **JSON** y sirve el frontend.

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/.../LosMontoneros.TP.git
```

### 2. Instalar dependencias del backend

Desde la carpeta `backend/`:

```bash
cd backend
npm install
```

### 3. Iniciar el servidor

```bash
npm run dev
```

### 4. Abrir el navegador

```
http://localhost:3000
```

El backend sirve automáticamente el **frontend** desde esa ruta.

---

## 🔗 Comunicación entre frontend y backend

* El frontend **nunca accede directo a la base de datos**.
* Usa `fetch()` hacia endpoints del backend:

  ```
  GET  /api/products     → lista productos activos
  POST /api/sales        → registra una venta
  POST /api/admin/login  → login de administrador
  ```
* El backend responde siempre en formato JSON.

---

## 🧱 Tecnología utilizada

**Frontend:** HTML, CSS, JavaScript
**Backend:** Node.js, Express, Sequelize, SQLite
**ORM:** Sequelize (manejo de base de datos sin SQL manual)

---

## 🧠 Flujo de trabajo

1. El servidor Express levanta en el puerto 3000.
2. Sirve los archivos del frontend.
3. El frontend se carga desde `index.html`.
4. Cuando el usuario navega (welcome → productos → carrito → ticket), el frontend solicita y envía datos al backend mediante `fetch()`.

---

## ⚠️ Advertencias npm

Durante `npm install` puede aparecer:

```
validator.js has a URL validation bypass vulnerability...
```

No ejecutar `npm audit fix --force`.
No afecta el proyecto.
El backend funciona correctamente con Sequelize 6.x.

---

## 👥 Equipo

**Los Montoneros – Programación III**

* Kevin Damian Paniagua
* Facundo Damian Fernandez