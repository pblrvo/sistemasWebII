var express = require('express');
var router = express.Router();
const parser = require('xml2json');
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
      const count = req.query.count || 3;
      const currentOffset = Math.floor(Date.now() / 1000); // Obtener la fecha y hora actual en segundos
      const response = await axios.get(`http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=${count}&maxlength=300&format=xml&enddate=${currentOffset}`);
      const jsonData = parser.toJson(response.data, { object: true });
      res.json({ data: jsonData, offset: currentOffset });
    } catch (error) {
      console.error('Error al obtener los datos de la API externa:', error);
      res.status(500).send('Error al obtener los datos de la API externa');
    }
  });


module.exports = router;