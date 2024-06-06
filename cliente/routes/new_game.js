const express = require('express');
const router = express.Router();
const axios = require('axios');  // Import axios for making HTTP requests

router.get('/', (req, res) => {
    res.render('new_game');
  });

// Route to handle form submission
router.post('/', async (req, res) => {
  const { header_image, name, short_description, price, release_date, categories, genres } = req.body;

  const newGame = {
    header_image, // URL provided by the user
    name,
    short_description,
    price,
    release_date,
    categories,
    genres
  };

  try {
    const response = await axios.post('http://localhost:3010/api/v1/new_game', newGame);

    if (response.status === 201) { // Check for successful creation (created status code)
      res.redirect('/noticias'); // Redirect to the list of games (assuming it exists)
    } else {
      console.error('Error creating game on database server:', response.data);
      res.status(response.status).send('Error al crear el juego'); // Forward error status and message
    }
  } catch (err) {
    console.error('Error sending game data to database server:', err);
    res.status(500).send('Error al crear el juego'); // Generic error message for user
  }
});

module.exports = router;
