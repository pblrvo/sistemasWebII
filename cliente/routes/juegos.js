const express = require('express');
const router = express.Router();
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS, 10);
const axios = require('axios');

const url = 'http://localhost:3010/api/v1/juegos';
// Obtener juegos
router.get('/', async (req, res) => {
    let params = {};
  
    if (req.query.limit) {
      params.limit = req.query.limit;
    }
  
    if (req.query.next) {
      params.next = req.query.next;
    } else if (req.query.prev) {
      params.prev = req.query.prev;
    }
  
    if (req.query.search) {
      params.search = req.query.search;
    }
  
    try {
      const response = await axios.get(url, { params }); // Send query parameters
      const gamesData = response.data;
  
      res.render('juegos', { results: gamesData.results, next: gamesData.next, prev: gamesData.prev });
    } catch (err) {
      console.error('Error fetching games:', err);
      res.status(500).send('Error al obtener juegos');
    }
});

// Obtener juego por nombre
router.get('/:name', async (req, res) => {
    const gameName = req.params.name;  
    try {
      const response = await axios.get(url+"/"+gameName);
      const gameData = response.data;
  
      
      res.render('game_details', { game: gameData });
    } catch (err) {
      console.error('Error fetching game details:', err);
      
      if (err.response && err.response.status === 404) {
        res.status(404).render('error', { message: 'Juego no encontrado' }); 
      } else {
        res.status(500).send('Error al obtener detalles del juego');
      }
    }
});


// Eliminar juego por ID
router.delete('/:id', async (req, res) => {
    const gameId = req.params.id;  
    try {
      const response = await axios.delete(url+"/"+gameId);
  
      if (response.status === 200) {
        res.status(200).send('ok')
    } else {
        console.error('Error deleting game:', response.data);
        res.status(500).send('Error al eliminar el juego');
      }
    } catch (err) {
      console.error('Error during game deletion:', err);
      res.status(500).send('Error al eliminar el juego');
    }
});

module.exports = router;
