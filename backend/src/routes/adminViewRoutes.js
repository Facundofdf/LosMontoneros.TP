// ===============================
// adminViweRoutes.js
// ===============================
import { Router } from 'express';
import authAdminView from '../middlewares/authAdminView.js';
import { login } from '../controllers/adminController.js';
import {
  renderLogin,
  renderDashboard,
  renderProductoForm
} from '../controllers/adminViewController.js';

const router = Router();

// Redirige al login por defecto
router.get('/', (req, res) => res.redirect('/admin/login'));

// 🟢 Login público
router.get('/login', renderLogin);
router.post('/login', login);

// 🔒 A partir de acá, todas las rutas requieren sesión
router.use(authAdminView);

// Vistas protegidas
router.get('/dashboard', renderDashboard);
router.get('/productos/nuevo', renderProductoForm);
router.get('/productos/:id/editar', renderProductoForm);

export default router;
