// ==============================
//  CARRITO GLOBAL UNIFICADO
// ==============================

export const Cart = {

    data: {}, // { id: { id, cantidad } }

    load() {
        try {
            const raw = localStorage.getItem('carrito');
            this.data = raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error("Error cargando carrito:", e);
            this.data = {};
        }
    },

    save() {
        const items = Object.values(this.data);
        localStorage.setItem('carrito', JSON.stringify(items));
        this.updateNavbarCount();
    },
 
    add(id) {
        if (!this.data[id]) this.data[id] = { id, cantidad: 0 };
        this.data[id].cantidad++;
        this.save();
    },
 
    decrease(id) {
        if (!this.data[id]) return;
        this.data[id].cantidad--;
        if (this.data[id].cantidad <= 0) delete this.data[id];
        this.save();
    },
 
    remove(id) {
        delete this.data[id];
        this.save();
    },
 
    count() {
        return Object.values(this.data)
            .reduce((acc, item) => acc + item.cantidad, 0);
    },
 
    updateNavbarCount() {
        const el = document.getElementById("cart-count");
        if (!el) return;
        el.textContent = this.count();
    }
};

// Al cargar la página
Cart.load();
Cart.updateNavbarCount();
