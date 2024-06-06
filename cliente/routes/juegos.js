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
  
      // Render the details view with game data (replace with your actual view name)
      res.render('game_details', { game: gameData });
    } catch (err) {
      console.error('Error fetching game details:', err);
      
      // Handle cases where the game is not found (404) or other errors
      if (err.response && err.response.status === 404) {
        res.status(404).render('error', { message: 'Juego no encontrado' }); // Error view with message
      } else {
        res.status(500).send('Error al obtener detalles del juego');
      }
    }
});


// Eliminar juego por ID
router.delete('/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const dbConnect = dbo.getDb();
  let result = await dbConnect.collection('juegos').deleteOne(query);
  res.status(200).send(result);
});

module.exports = router;
