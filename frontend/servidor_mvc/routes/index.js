const express = require('express');
const router = express.Router();

// Pantalla de bienvenida
router.get('/', (req, res) => {
    res.render('bienvenida');  // Renderiza la vista bienvenida.ejs
});

module.exports = router;
