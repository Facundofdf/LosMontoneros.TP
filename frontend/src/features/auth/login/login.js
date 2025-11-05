import { authService } from '../authService.js';

export function mountLogin(root, { onSuccess, onVolver } = {}) {
    const shadow = root;

    Promise.all([
        fetch('./features/auth/login/login.html').then(r => r.text()),
        fetch('./features/auth/login/login.css').then(r => r.text())
    ]).then(([html, css]) => {
        shadow.innerHTML = `<style>${css}</style>${html}`;

        const form = shadow.querySelector('#login-form');
        const errorEl = shadow.querySelector('#login-error');
        
        // --- AÑADIDO: Conectar el botón "Tester" ---
        const testerBtn = shadow.querySelector('#tester-btn');
        const userInput = shadow.querySelector('[name="username"]');
        const passInput = shadow.querySelector('[name="password"]');

        testerBtn.addEventListener('click', () => {
            // Rellena el formulario con datos de prueba
            userInput.value = "admin@test.com"; // O el usuario que prefieras
            passInput.value = "1234";

            // Dispara el evento 'submit' del formulario
            // para reutilizar la misma lógica de login
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        });
        
        const volverBtn = shadow.querySelector('#volver-btn');
        if (volverBtn && onVolver) {
            volverBtn.addEventListener('click', onVolver);
        }

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const user = userInput.value.trim(); // Usamos la referencia
            const pass = passInput.value;      // Usamos la referencia

            if (!user || !pass) {
                errorEl.textContent = 'Completa los campos.';
                return;
            }

            try {
                errorEl.textContent = ''; // Limpiar error
                // ESTA ES LA LÍNEA CLAVE.
                // Necesitamos ver 'authService.js' para simular esto.
                await authService.login(user, pass); 
                
                if (onSuccess) onSuccess();
            } catch (err) {
                errorEl.textContent = err.message || 'Error.';
            }
        });
    });
}