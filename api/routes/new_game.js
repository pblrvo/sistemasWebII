const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');

// Route to display the form
router.get('/', (req, res) => {
  res.render('new_game');
});

// Route to handle form submission
router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  
  const { header_image, name, short_description, price, release_date, categories, genres } = req.body;

  const categoriesArray = categories.split(',').map(item => item.trim());
  const genresArray = genres.split(',').map(item => item.trim());

  try {
    const newGame = {
      header_image, // URL provided by the user
      name,
      short_description,
      price,
      release_date,
      categories: categoriesArray,
      genres: genresArray
    };

    const result = await dbConnect.collection('juegos').insertOne(newGame);

    if (result.acknowledged) {
      res.redirect('/api/v1/juegos'); // Redirect to the list of games
    } else {
      res.status(500).send("No se pudo crear el juego");
    }
  } catch (err) {
    console.error('Error al crear el juego:', err);
    res.status(500).send('Error al crear el juego');
  }
});

module.exports = router;
