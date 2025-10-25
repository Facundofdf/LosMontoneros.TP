const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Ruta de archivos en desarrollo. Disculpe las molestias.');
});

module.exports = router;
