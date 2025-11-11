// backend/src/middlewares/authAdminView.js
export default function authAdminView(req, res, next) {
  if (req.session?.adminId) return next();
  return res.redirect('/admin/login');
}
