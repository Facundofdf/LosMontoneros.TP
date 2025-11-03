import { mountWelcome } from "./features/welcome/welcome.js";
import { mountMaintenance } from "./features/maintenance/maintenance.js";
import { mountProductos } from "./features/productos/productos.js";
import { mountCarrito } from "./features/carrito/carrito.js";
import { mountTicket } from "./features/ticket/ticket.js";

import { getPreferredTheme, setTheme, connectThemeButton } from "./features/shared/theme.js";

const app = document.getElementById("app");
let navbarHtml = "";

/* ===================== MANEJO DEL TEMA ===================== */
setTheme(getPreferredTheme());

/* ===================== MANEJO DEL CARRITO ===================== */
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarProductoAlCarrito(productId) {
  const itemEnCarrito = carrito.find((item) => item.id === productId);
  if (itemEnCarrito) {
    itemEnCarrito.cantidad++;
  } else {
    carrito.push({ id: productId, cantidad: 1 });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const contadorEl = document.getElementById("cart-counter");
  if (contadorEl) {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contadorEl.textContent = totalItems;
    contadorEl.style.display = totalItems > 0 ? "inline" : "none";
  }
}

function eliminarProductoDelCarrito(productId) {
  carrito = carrito.filter((item) => item.id !== productId);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

/**
 * Disminuye en 1 la cantidad de un producto en el carrito.
 * Si la cantidad llega a 0, lo elimina.
 */
function disminuirCantidadDelCarrito(productId) {
  // Buscamos el item en el estado local 'carrito'
  const itemEnCarrito = carrito.find((item) => item.id === productId);

  if (!itemEnCarrito) return; // No debería pasar si el botón está en pantalla

  if (itemEnCarrito.cantidad > 1) {
    // Si hay más de 1, solo restamos
    itemEnCarrito.cantidad--;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
  } else {
     // Si solo queda 1, llamamos a la función de eliminar
    eliminarProductoDelCarrito(productId);
  }
}

/* ===================== MANEJO DE AUTENTICACIÓN (Auth) ===================== */

/**
 * ¡NUEVO! Cierra la sesión del usuario.
 */
function logout() {
  console.log("Cerrando sesión...");
  localStorage.removeItem("user_name");

  // Opcional: También limpiar el carrito al cerrar sesión
  localStorage.removeItem("carrito");
  carrito = []; // Resetear el estado en memoria

  // Redirigir al inicio
  navigate("/inicio");
}

function restartApp() {
    console.log("Reiniciando aplicación...");
    localStorage.removeItem("user_name");
    localStorage.removeItem("carrito");
    carrito = []; // Resetea el estado en memoria

    actualizarContadorCarrito(); // Actualiza el contador (lo pone en 0)
    navigate("/inicio"); // Vuelve al inicio
}

/* ===================== ROUTER Y NAVEGACIÓN ===================== */

/**
 * Carga el HTML del navbar en la cache
 */
async function loadLayout() {
  try {
    // Asegúrate que esta ruta sea correcta desde index.html
    navbarHtml = await fetch("./components/navbar.html").then((r) => r.text());
  } catch (err) {
    console.error("Error al cargar el layout del navbar:", err);
    navbarHtml = "<p>Error al cargar navbar. Revisa la ruta.</p>";
    app.innerHTML = navbarHtml;
  }
}

/**
 * Conecta los listeners del navbar y actualiza contadores.
 * Se debe llamar CADA VEZ que se dibuja el navbar.
 */
function conectarListenersGlobales(userName) {
  // Conectar botón de tema
  const toggleBtn = document.getElementById("theme-toggle-btn");
  connectThemeButton(toggleBtn);
  // ¡NUEVO! Conectar botón de logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
  actualizarContadorCarrito(); // Actualiza el contador (lo pone en 0 si limpiamos)
  const userNameEl = document.getElementById("navbar-user-name");
  if (userNameEl) {
    userNameEl.textContent = `Hola ${userName} ☺`;
  }
}

/**
 * Función principal del Router y Layout Manager.
 */
function route(path) {
  const userName = localStorage.getItem("user_name"); // 1. ======= GUARDIA DE AUTENTICACIÓN =======
  if (!userName && path !== "/inicio") {
    console.warn("Usuario no logueado. Redirigiendo a /inicio.");
    navigate("/inicio");
    return;
  }
  if (userName && path === "/inicio") {
    navigate("/productos");
    return;
  } // 2. ======= RENDERIZADO DE LAYOUT =======

  let currentViewContainer;

  if (!userName) {
    // === LAYOUT PÚBLICO (Deslogueado) ===
    app.innerHTML = "";
    currentViewContainer = app;
  } else {
    // === LAYOUT PRIVADO (Logueado) ===
    app.innerHTML = navbarHtml;
    const contentView = document.createElement("div");
    contentView.id = "content-view";
    app.appendChild(contentView);
    currentViewContainer = contentView;
    conectarListenersGlobales(userName); // <-- Conecta el botón de logout
  } // 3. ======= RENDERIZADO DE VISTA =======

  switch (path) {
    case "/inicio":
      mountWelcome(currentViewContainer, {
        onContinue: (name) => {
          navigate("/productos");
        },
      });
      break;
    case "/productos":
      mountProductos(currentViewContainer, {
        onAgregar: agregarProductoAlCarrito,
      });
      break;
    case "/carrito":
      mountCarrito(currentViewContainer, {
        onRemove: eliminarProductoDelCarrito, 
        onAdd: agregarProductoAlCarrito,      
        onDecrease: disminuirCantidadDelCarrito
      });
      break;
    case "/ticket":
      mountTicket(currentViewContainer, {
        onRestart: restartApp 
      });
      break;
    case "/trabajando":
      mountMaintenance(currentViewContainer, {
        error: "Esta sección aún no está implementada.",
        onReturn: () => navigate("/productos"),
      });
      break;
    default:
      mountMaintenance(currentViewContainer, {
        error: `Ruta no encontrada: ${path}`,
        onReturn: () => navigate(userName ? "/productos" : "/inicio"),
      });
      break;
  }
}

/* ---------- Navegación ---------- */
function navigate(path) {
  if (location.hash.slice(1) !== path) {
    location.hash = path;
  } else {
    safeRoute();
  }
}

/* ---------- Manejo de errores seguro ---------- */
function safeRoute() {
  try {
    const currentPath = location.hash.slice(1) || "/inicio";
    route(currentPath);
  } catch (err) {
    console.error("Error fatal en el router:", err);
    mountMaintenance(app, {
      error: err.message || String(err),
      onReturn: () => navigate("/inicio"),
    });
  }
}

/* ---------- Eventos de Inicialización ---------- */
window.addEventListener("hashchange", safeRoute);

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Carga el layout ANTES de intentar rutear
  await loadLayout(); // 2. Ahora sí, corre el router por primera vez
  safeRoute();
});
