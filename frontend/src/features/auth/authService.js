export const authService = {
    async login(username, password) {
        
        // 1. Simular un retraso de red
        await new Promise(resolve => setTimeout(resolve, 300));

        // 2. Simulación realista usando los datos del "Tester"
        if (username === "admin@test.com" && password === "1234") {

            // ¡ESTE ES EL ARREGLO!
            // Guardamos el 'user_name' que app.js espera para su guardia.
            localStorage.setItem('user_name', username);

            // Guardamos el token (como ya hacías)
            localStorage.setItem('auth_token', 'demo-token');

            // Devolvemos el éxito
            return { token: 'demo-token', name: username };

        } else {
            // 3. Simular un error si las credenciales no coinciden
            throw new Error('Credenciales inválidas. (Prueba con "admin@test.com" / "1234")');
        }
    },

    logout() {
        // Importante: Limpiar AMBAS claves al cerrar sesión
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_name');
    },

    getToken() {
        return localStorage.getItem('auth_token');
    }
};