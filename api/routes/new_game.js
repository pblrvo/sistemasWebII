const express = require('express');
const router = express.Router();


// Route to display the form
router.get('/', (req, res) => {
  res.render('new_game');
});

// Route to handle form submission
router.post('/', async (req, res) => {
  const { header_image, name, short_description, price, release_date, categories, genres } = req.body;

  // Convert categories and genres to arrays
  const categoriesArray = categories.split(',').map(item => item.trim());
  const genresArray = genres.split(',').map(item => item.trim());

  try {
    // Create a new game instance
    const newGame = new Game({
      header_image,
      name,
      short_description,
      price,
      release_date,
      categories: categoriesArray,
      genres: genresArray
    });

    // Save the game to the database
    await newGame.save();

    // Redirect to the list of games (or any other page you want)
    res.redirect('/juegos');
  } catch (error) {
    console.error('Error creating new game:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
