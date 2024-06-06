var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3010/api/v1/juegos-gratuitos');
    const juegos = response.data;
    res.render('juegos-gratuitos', { juegos });
  } catch (error) {
    console.error('Error al obtener los datos de la API de Gametrade:', error);
    res.status(500).send('Error al obtener los datos de la API de Gametrade');
  }
});

module.exports = router;
