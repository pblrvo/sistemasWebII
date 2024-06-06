const express = require('express');
const router = express.Router();
const axios = require('axios');

const url = 'http://localhost:3010/api/v1/info_juego';

// Obtener información de un juego por ID
router.get('/:_id', async (req, res) => {
  const gameId = req.params._id;
  try {
    const response = await axios.get(url+"/"+gameId);
    const gameData = response.data;
    // Render the info_juego view with fetched game data
    res.render('info_juego', { juego: gameData, baseUri: process.env.BASE_URI || '/client/v1' });
  } catch (err) {
    console.error('Error fetching game details:', err);
    
    if (err.response && err.response.status === 404) {
      res.status(404).render('error', { message: 'Juego no encontrado' }); 
    } else {
      res.status(500).send('Error al obtener el juego');
    }
  }
});

module.exports = router;
