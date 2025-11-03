// /src/features/maintenance/maintenance.js

export function mountMaintenance(root, { onReturn, error } = {}) {
    const shadow = root; 


    Promise.all([
        fetch('./features/maintenance/maintenance.html').then(r => r.text()),
        fetch('./features/maintenance/maintenance.css').then(r => r.text())
    ]).then(([html, css]) => {
        shadow.innerHTML = `<style>${css}</style>${html}`;

        const btn = shadow.querySelector('#btn-volver');
        const errorBox = shadow.querySelector('#error-details');

        if (error) {
            errorBox.textContent =
                typeof error === 'string' ? error : JSON.stringify(error, null, 2);
        } else {
            errorBox.style.display = 'none';
        }

        btn.addEventListener('click', () => {
            if (onReturn) onReturn();
        });
    });
}
