let propsGlobales = {};
let productosCache = [];
let carrito = {}; // { id: { producto, cantidad } }

// 🧠 Guardar carrito en localStorage
function guardarCarrito() {
    const items = Object.values(carrito).map(({ producto, cantidad }) => ({
        id: producto.id,
        cantidad
    }));
    localStorage.setItem('carrito', JSON.stringify(items));
}

// 🧠 Cargar carrito desde localStorage
function cargarCarrito() {
    const data = localStorage.getItem('carrito');
    if (!data) return;
    try {
        const items = JSON.parse(data);
        items.forEach(({ id, cantidad }) => {
            const producto = productosCache.find(p => p.id == id);
            if (producto) carrito[id] = { producto, cantidad };
        });
    } catch (e) {
        console.error('Error al cargar carrito:', e);
    }
}

// 🔄 Cargar productos
async function cargarProductos(categoria = null) {
    let url = '/api/productos';
    if (categoria && categoria !== 'todos') url += `?categoria=${categoria}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        productosCache = data.productos;
        renderProductos(productosCache);

        // 👇 Después de tener los productos disponibles, restauramos el carrito
        cargarCarrito();
        renderCarrito();
    } catch (err) {
        console.error(err);
    }
}

// 🧱 Renderizar productos
function renderProductos(productos) {
    const container = document.getElementById('product-list');
    if (!container) return;
    container.innerHTML = '';

    productos.forEach(p => {
        container.innerHTML += `
      <div class="card">
        <img src="${p.imagen || 'https://placehold.co/300x200'}" alt="${p.nombre}">
        <div class="card-body">
          <h5 class="name">${p.nombre}</h5>
          <p class="description">${p.descripcion || ''}</p>
          <p class="price"><strong>$${p.precio.toLocaleString()}</strong></p>
          <button class="btn btn-primary btn-agregar" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    `;
    });
}

// 🛒 Renderizar carrito
function renderCarrito() {
    const contenedor = document.getElementById('cart-items');
    const totalElem = document.getElementById('cart-total');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    const productos = Object.values(carrito);
    if (productos.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-muted">Carrito vacío</p>';
        if (totalElem) totalElem.textContent = 'Total: $0';
        return;
    }

    let total = 0;
    productos.forEach(({ producto, cantidad }) => {
        const subtotal = producto.precio * cantidad;
        total += subtotal;

        contenedor.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${producto.nombre}</strong><br>
          <small>${cantidad} x $${producto.precio.toLocaleString()}</small>
        </div>
        <div class="cart-actions">
          <button class="btn btn-sm btn-light btn-mas" data-id="${producto.id}">+</button>
          <button class="btn btn-sm btn-light btn-menos" data-id="${producto.id}">−</button>
          <button class="btn btn-sm btn-danger btn-remove" data-id="${producto.id}">×</button>
        </div>
      </div>
    `;
    });

    if (totalElem) totalElem.textContent = `Total: $${total.toLocaleString()}`;
}

// ➕ Agregar producto al carrito
function agregarAlCarrito(id) {
    const producto = productosCache.find(p => p.id == id);
    if (!producto) return;

    if (!carrito[id]) carrito[id] = { producto, cantidad: 0 };
    carrito[id].cantidad++;

    guardarCarrito(); // 🔒 Guardar en localStorage
    renderCarrito();

    propsGlobales.onAgregar?.(id); // mantiene compatibilidad
}

// ⚙️ Eventos
function attachEvents() {
    // Categorías
    document.getElementById('categoria-list')?.addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
            document.querySelectorAll('#categoria-list li').forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');
            cargarProductos(e.target.dataset.categoria);
        }
    });

    // Botones "Agregar"
    document.getElementById('product-list')?.addEventListener('click', e => {
        if (e.target.classList.contains('btn-agregar')) {
            agregarAlCarrito(e.target.dataset.id);
        }
    });

    // Acciones del carrito (+, -, eliminar)
    document.getElementById('cart-items')?.addEventListener('click', e => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('btn-mas')) {
            carrito[id].cantidad++;
        } else if (e.target.classList.contains('btn-menos')) {
            carrito[id].cantidad--;
            if (carrito[id].cantidad <= 0) delete carrito[id];
        } else if (e.target.classList.contains('btn-remove')) {
            delete carrito[id];
        }

        guardarCarrito(); // 🔒 Persistir cambios
        renderCarrito();
    });
}

// 🚀 Montaje de la vista de productos
export function mountProductos(container, props) {
    propsGlobales = props || {};

    Promise.all([
        fetch('./features/productos/productos.html').then(r => r.text()),
        fetch('./features/productos/productos.css').then(r => r.text())
    ])
        .then(([html, css]) => {
            container.innerHTML = `<style>${css}</style>${html}`;
            cargarProductos(); // Esto también cargará el carrito una vez los productos estén listos
            attachEvents();
        })
        .catch(err => {
            container.innerHTML = `<p>Error al montar productos: ${err.message}</p>`;
        });
}
