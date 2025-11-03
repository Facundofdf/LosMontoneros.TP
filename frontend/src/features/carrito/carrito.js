// Variable para guardar las props (función onRemove)
let propsGlobales = {};

// --- Funciones de Renderizado ---

/**
 * Pinta los items detallados en el DOM.
 */
function renderCartItems(detailedCart, container) {
  container.innerHTML = "";
  detailedCart.forEach((item) => {
    const itemTotal = item.precio * item.cantidad;
    const itemHtml = `
            <div class="cart-item">
                <img src="${
      item.imagen || "https://placehold.co/100x100/eee/aaa?text=Sin+Imagen"
    }" alt="${item.nombre}">
                <div class="cart-item-info">
                    <h5>${item.nombre}</h5>
                    <p>Precio unitario: $${item.precio.toFixed(2)}</p>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn btn-decrease" data-id="${
                          item.id
                        }">-</button>
                        <span>${item.cantidad}</span>
                        <button class="quantity-btn btn-increase" data-id="${
                          item.id
                        }">+</button>
                    </div>
                    <div class="cart-item-price">
                        <strong>$${itemTotal.toFixed(2)}</strong>
                    </div>
                    <button class="cart-item-remove" data-id="${
      item.id
    }">Eliminar</button>
                </div>
            </div>
        `;
    container.innerHTML += itemHtml;
  });
}

/**
 * Calcula y pinta el total en el resumen.
 */
function renderSummary(detailedCart, totalEl) {
  const total = detailedCart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );
  totalEl.textContent = `$${total.toFixed(2)}`;
}

/**
 * Conecta los listeners para los botones "Eliminar".
 */
function attachEventListeners(container) {
  container.addEventListener("click", (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (!id) return;

    if (target.classList.contains("cart-item-remove")) {
      if (propsGlobales.onRemove) {
        propsGlobales.onRemove(id);
      }
      loadCartData();
    }
    if (target.classList.contains("btn-increase")) {
      if (propsGlobales.onAdd) {
        propsGlobales.onAdd(id);
      }
      loadCartData();
    }
    if (target.classList.contains("btn-decrease")) {
      if (propsGlobales.onDecrease) {
        propsGlobales.onDecrease(id);
      }
      loadCartData();
    }
  });
}

/**
 * Lógica principal: Carga datos y maneja los estados de la UI.
 */
async function loadCartData() {
  // 1. Obtener referencias del DOM
  const loadingEl = document.getElementById("cart-loading");
  const emptyEl = document.getElementById("cart-empty");
  const contentEl = document.getElementById("cart-content");
  const itemsContainer = document.getElementById("cart-items-container");
  const totalEl = document.getElementById("cart-total-price"); // 2. Leer carrito de localStorage

  const cart = JSON.parse(localStorage.getItem("carrito")) || []; // 3. Manejar estado "vacío"

  if (cart.length === 0) {
    loadingEl.style.display = "none";
    contentEl.style.display = "none";
    emptyEl.style.display = "block";
    return;
  } // 4. Si hay items, buscar sus detalles

  try {
    // Creamos un array de promesas de fetch
    const fetchPromises = cart.map((item) => {
      return fetch(`/api/productos/${item.id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Producto ${item.id} no encontrado`);
          return res.json();
        })
        .then((productData) => ({
          ...productData, // id, nombre, precio, imagen...
          cantidad: item.cantidad, // ...le añadimos la cantidad
        }));
    }); // Esperamos a que todas las promesas se resuelvan

    const detailedCart = await Promise.all(fetchPromises); // 5. Renderizar el contenido

    renderCartItems(detailedCart, itemsContainer);
    renderSummary(detailedCart, totalEl); // 6. Mostrar el contenido y ocultar la carga
    loadingEl.style.display = "none";
    emptyEl.style.display = "none";
    contentEl.style.display = "block";
  } catch (error) {
    console.error("Error al cargar detalles del carrito:", error);
    loadingEl.innerHTML = `<p class="text-danger">Error al cargar el carrito. ${error.message}</p>`;
  }
}

/**
 * Función de montaje principal (exportada).
 */
export function mountCarrito(container, props) {
  propsGlobales = props || {}; // Guardar props (onRemove)

  Promise.all([
    fetch("./features/carrito/carrito.html").then((r) => r.text()),
    fetch("./features/carrito/carrito.css").then((r) => r.text()),
  ])
    .then(([html, css]) => {
      // 1. Inyectar CSS y HTML
      container.innerHTML = `<style>${css}</style>${html}`; 
      // 2. Ejecutar la lógica principal
      loadCartData(); 
      // 3. Conectar listeners (usando delegación de eventos)
      const itemsContainer = document.getElementById("cart-items-container");
      if (itemsContainer) {
        attachEventListeners(itemsContainer);
      }
      //Inicio de logica del modal
      const modalElement = document.getElementById('confirmarCompraModal');
      if(typeof bootstrap !== 'undefined'){
        const confirmarModal = new bootstrap.Modal(modalElement);

        //Obtener todos los botones
        const btnMostrarModal = document.getElementById('btn-show-confirm-modal');
        const btnConfirmarCompra = document.getElementById('btn-confirmar-compra');

        // 6. Asignar evento para MOSTRAR el modal
        if(btnMostrarModal) {
            btnMostrarModal.addEventListener('click', () => {
                confirmarModal.show();
            });
        }

        // 7. Asignar evento para CONFIRMAR e ir al Ticket
        if(btnConfirmarCompra) {
            btnConfirmarCompra.addEventListener('click', () => {
                // Opcional: ocultar el modal antes de navegar
                confirmarModal.hide(); 
                // Redirigir a la pantalla de ticket
                window.location.hash = '/ticket'; 
            });
        }
      }else {
        console.warn('Bootstrap no está cargado, el modal de confirmación no funcionará.');
        // Fallback por si Bootstrap no carga: redirigir directamente
        const btnMostrarModal = document.getElementById('btn-show-confirm-modal');
        if(btnMostrarModal) {
              btnMostrarModal.addEventListener('click', () => {
                  console.warn('Bootstrap no detectado. Redirigiendo a /ticket directamente.');
                  window.location.hash = '/ticket';
              });
        }
      }
    })
    .catch((err) => {
      console.error("Fallo el montaje del carrito:", err);
      container.innerHTML = `<p>Error al cargar la sección del carrito.</p>`;
    });
}
