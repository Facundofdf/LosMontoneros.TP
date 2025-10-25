const express = require('express');
const router = express.Router();

//GET /users
router.get('/', (req, res) => {
    res.render('Ruta de bienvenida usuarios.');
});

module.exports = router;