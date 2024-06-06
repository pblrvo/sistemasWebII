var express = require('express');
var router = express.Router();
const parser = require('xml2json');
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:3010/api/v1/noticias');
      res.render('noticias', { data: response.data.data, offset: response.offset });
    } catch (error) {
      console.error('Error al obtener los datos de la API externa:', error);
      res.status(500).send('Error al obtener los datos de la API externa');
    }
  });


module.exports = router;