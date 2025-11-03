import { authService } from '../authService.js';

export function mountLogin(root, { onSuccess } = {}) {
    const shadow = root.attachShadow({ mode: 'open' });

    Promise.all([
        fetch('./features/auth/login/login.html').then(r => r.text()),
        fetch('./features/auth/login/login.css').then(r => r.text())
    ]).then(([html, css]) => {
        shadow.innerHTML = `<style>${css}</style>${html}`;

        const form = shadow.querySelector('#login-form');
        const errorEl = shadow.querySelector('#login-error');

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const user = form.username.value.trim();
            const pass = form.password.value;

            if (!user || !pass) {
                errorEl.textContent = 'Completa los campos.';
                return;
            }

            try {
                await authService.login(user, pass);
                if (onSuccess) onSuccess();
            } catch (err) {
                errorEl.textContent = err.message || 'Error.';
            }
        });
    });
}
