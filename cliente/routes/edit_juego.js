const express = require('express');
const router = express.Router();
const axios = require('axios'); 

const url = 'http://localhost:3010/api/v1/edit_juego';

// Obtener información de un juego por ID para editar
router.get('/:_id', async (req, res) => {
  const gameId = req.params._id;

  try {
    const response = await axios.get(url+"/"+gameId);
    const gameData = response.data;

    // Render the edit_juego view with fetched game data
    res.render('edit_juego', { juego: gameData, baseUri: process.env.BASE_URI || '/cliente/v1' });
  } catch (err) {
    console.error('Error fetching game details:', err);
    
    // Handle cases where the game is not found (404) or other errors
    if (err.response && err.response.status === 404) {
      res.status(404).render('error', { message: 'Juego no encontrado' }); // Error view with message
    } else {
      res.status(500).send('Error al obtener el juego para editar');
    }
  }
});

// Guardar cambios en la información de un juego
router.post('/:_id', async (req, res) => {
  const gameId = req.params._id;
  const {name, short_description, price, release_date, categories, genres } = req.body;
  const updateData = {
    name,
    short_description,
    price,
    release_date,
    categories,
    genres
  };

  try {
    const response = await axios.post(url+"/"+gameId, updateData); 
    console.log(response)
    if (response.status === 200) {
      const baseUri = process.env.BASE_URI || '/api/v1';
      res.redirect(`${baseUri}/info_juego/${gameId}`);
    } else {
      console.error('Error updating game:', response.data);
      res.status(500).send('Error al actualizar el juego');
    }
  } catch (err) {
    console.error('Error during game update:');
    res.status(500).send('Error al actualizar el juego');
  }
});

module.exports = router;
