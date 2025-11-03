export const authService = {
    async login(username, password) {
        // Simulación sin backend
        localStorage.setItem('auth_token', 'demo-token');
        return { token: 'demo-token' };
    },
    logout() {
        localStorage.removeItem('auth_token');
    },
    getToken() {
        return localStorage.getItem('auth_token');
    }
};
