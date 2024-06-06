var express = require('express');
var router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const count = req.query.count || 3;
        const response = await axios.get(`http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=${count}&maxlength=300&format=xml`);
        
        res.set('Content-Type', 'application/xml');
        res.send(response.data);
    } catch (error) {
        console.error('Error al obtener los datos de la API externa:', error);
        res.status(500).send('Error al obtener los datos de la API externa');
    }
});

module.exports = router;
