var express = require('express');
var router = express.Router();
const parser = require('xml2json');
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
      const response = await axios.get('https://www.freetogame.com/api/games');
      const juegos = response.data;
  
      res.render('juegos-gratuitos', { juegos });
    } catch (error) {
      console.error('Error al obtener los datos de la API de FreeToGame:', error);
      res.status(500).send('Error al obtener los datos de la API de FreeToGame');
    }
  });


module.exports = router;