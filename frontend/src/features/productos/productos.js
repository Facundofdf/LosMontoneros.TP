let currentCategoria = null;
let currentPage = 1;
let propsGlobales = {}; // Para guardar las 'props' (ej: onAgregar)

// 1. Cargar y Renderizar Datos
async function cargarProductos(categoria = null, page = 1) {
    currentCategoria = categoria;
    currentPage = page;
    
    let url = `/api/productos?page=${page}&limit=9`; 
    if (categoria) url += `&categoria=${categoria}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la API');
        
        const data = await response.json();
        renderProductos(data.productos);
        renderPaginacion(data.totalPages, data.currentPage);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        const productList = document.getElementById('product-list');
        if (productList) {
            productList.innerHTML = `<p class="text-danger">Error al cargar productos.</p>`;
        }
    }
}

// 2. "Pintar" Productos
function renderProductos(productos) {
    const productList = document.getElementById('product-list');
    if (!productList) return; 
    
    productList.innerHTML = '';
    
    if (productos.length === 0) {
        productList.innerHTML = '<p class="col-12 text-center">No se encontraron productos para esta categoría.</p>';
        return;
    }
    
    productos.forEach(producto => {
        // Usamos los estilos de .card que definimos en el CSS
        const cardHtml = `
            <div class="col-md-4 mb-3">
                <div class="card h-100">
                    <img src="${producto.imagen || 'https://placehold.co/600x400/eee/aaa?text=Sin+Imagen'}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion || ''}</p>
                        <p class="card-text mt-auto mb-2">$${producto.precio.toFixed(2)}</p>
                        <button class="btn btn-primary btn-agregar" data-product-id="${producto.id}">Agregar</button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += cardHtml;
    });
}

// 3. "Pintar" Paginación
function renderPaginacion(totalPages, pageActual) {
    const paginationControls = document.getElementById('pagination-controls');
    if (!paginationControls) return;

    paginationControls.innerHTML = '';
    if (totalPages <= 1) return;

    let ul = '<ul class="pagination">';
    for (let i = 1; i <= totalPages; i++) {
        ul += `<li class="page-item ${i === pageActual ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }
    ul += '</ul>';
    paginationControls.innerHTML = ul;
}

// 4. Asignar Event Listeners (¡Clave!)
function attachEventListeners() {
    // Filtros
    // Usamos '?' (optional chaining) por si el elemento no existe
    const filtrosContainer = document.querySelector('.filtros');
    filtrosContainer?.addEventListener('click', (e) => {
        if (e.target.classList.contains('filtro-btn')) {
            const categoria = e.target.dataset.categoria;
            cargarProductos(categoria === 'todos' ? null : categoria, 1);
        }
    });

    // Paginación
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls?.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.dataset.page) {
            cargarProductos(currentCategoria, parseInt(e.target.dataset.page));
        }
    });
    
    // Botones "Agregar" (Usando delegación)
    const productList = document.getElementById('product-list');
    productList?.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const productId = e.target.dataset.productId;
            if (propsGlobales.onAgregar) {
                propsGlobales.onAgregar(productId);
            }
        }
    });
}

// --- Función de Montaje (MODIFICADA para seguir tu patrón) ---

export function mountProductos(container, props) {
    propsGlobales = props || {}; // Guardar las props (ej: onAgregar)

    Promise.all([
        // Ajusta las rutas si son diferentes
        fetch('./features/productos/productos.html').then(r => r.text()),
        fetch('./features/productos/productos.css').then(r => r.text())
    ])
    .then(([html, css]) => {
        // 1. Inyectar el CSS y el HTML (¡Igual que welcome.js!)
        container.innerHTML = `<style>${css}</style>${html}`;
        
        // 2. Ejecutar la lógica DESPUÉS de que el DOM esté listo
        cargarProductos(); // Carga los datos iniciales
        attachEventListeners(); // Asigna todos los listeners
    })
    .catch(err => {
        console.error('Fallo el montaje de productos:', err);
        container.innerHTML = `<p>Error al cargar la sección de productos. ${err.message}</p>`;
    });
}
