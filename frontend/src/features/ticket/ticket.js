import { connectThemeButton } from '../shared/theme.js';

let propsGlobales = {};
let detailedCartData = []; // Guardamos los datos para el PDF
let totalGeneral = 0;

/**
 * Carga los datos del ticket (usuario, fecha, productos)
 */
async function loadTicketData() {
    // 1. Obtener elementos del DOM
    const userEl = document.getElementById('ticket-user');
    const dateEl = document.getElementById('ticket-date');
    const listEl = document.getElementById('ticket-products-list');
    const totalEl = document.getElementById('ticket-total-price');
    const loadingEl = document.getElementById('ticket-loading');

    try {
        // 2. Llenar datos simples
        userEl.textContent = localStorage.getItem("user_name") || "Consumidor Final";
        dateEl.textContent = new Date().toLocaleDateString('es-AR'); // Formato de fecha local

        // 3. Lógica para buscar productos (igual a la del carrito)
        const cart = JSON.parse(localStorage.getItem("carrito")) || [];
        if (cart.length === 0) {
            document.getElementById('ticket-content').innerHTML = "<h2>Ticket ya procesado o carrito vacío.</h2><p>Redirigiendo al inicio...</p>";
            setTimeout(() => {
                if (propsGlobales.onRestart) propsGlobales.onRestart();
            }, 2500);
            return;
        }

        const fetchPromises = cart.map(item =>
            fetch(`/api/productos/${item.id}`)
                .then(res => res.json())
                .then(product => ({ ...product, cantidad: item.cantidad }))
        );

        const detailedCart = await Promise.all(fetchPromises);
        detailedCartData = detailedCart; // Guardar para el PDF

        // 4. Renderizar productos y total
        listEl.innerHTML = ''; // Limpiar "Cargando..."
        totalGeneral = 0;

        detailedCart.forEach(item => {
            const itemTotal = item.precio * item.cantidad;
            totalGeneral += itemTotal;
            listEl.innerHTML += `
                <li>
                    <span>${item.cantidad}x ${item.nombre}</span>
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </li>
            `;
        });

        totalEl.textContent = `$${totalGeneral.toFixed(2)}`;

    } catch (error) {
        console.error("Error al cargar ticket:", error);
        loadingEl.textContent = "Error al cargar datos.";
        loadingEl.style.color = "red";
    }
}

/**
 * Genera y descarga el PDF
 */
function handleDownloadPDF() {
    // Usamos el objeto global que cargamos desde el CDN
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Título y datos
    doc.setFontSize(20);
    doc.text("Ticket de Compra - Los Montoneros", 10, 20);
    doc.setFontSize(12);
    doc.text(`Cliente: ${localStorage.getItem("user_name") || "Consumidor Final"}`, 10, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 10, 37);
    doc.text("-------------------------------------------------------------------", 10, 45);

    // 2. Items del carrito
    let yPos = 55; // Posición Y inicial para los items
    detailedCartData.forEach(item => {
        const itemTotal = (item.precio * item.cantidad).toFixed(2);
        const itemText = `${item.cantidad}x ${item.nombre}`;
        const priceText = `$${itemTotal}`;
        
        doc.text(itemText, 10, yPos);
        doc.text(priceText, 180, yPos, { align: 'right' });
        yPos += 8; // Siguiente línea
    });

    // 3. Total
    yPos += 5; // Espacio
    doc.text("-------------------------------------------------------------------", 10, yPos);
    yPos += 10;
    doc.setFontSize(16);
    doc.text(`TOTAL: $${totalGeneral.toFixed(2)}`, 180, yPos, { align: 'right' });

    // 4. Guardar
    doc.save('ticket-compra-los-montoneros.pdf');
}

/**
 * Función de montaje principal
 */
export function mountTicket(container, props) {
    propsGlobales = props || {}; // Guardar { onRestart }

    Promise.all([
        fetch('./features/ticket/ticket.html').then(r => r.text()),
        fetch('./features/ticket/ticket.css').then(r => r.text())
    ])
    .then(([html, css]) => {
        container.innerHTML = `<style>${css}</style>${html}`;
        
        // Cargar los datos
        loadTicketData();

        // Conectar botones
        document.getElementById('ticket-btn-pdf').addEventListener('click', handleDownloadPDF);
        
        document.getElementById('ticket-btn-exit').addEventListener('click', () => {
            // Llama a la función de app.js
            if (propsGlobales.onRestart) {
                propsGlobales.onRestart();
            }
        });

        connectThemeButton(document.getElementById('ticket-theme-btn'));
    })
    .catch(err => {
        console.error('Fallo el montaje del ticket:', err);
        container.innerHTML = `<p>Error al cargar el ticket.</p>`;
    });
}