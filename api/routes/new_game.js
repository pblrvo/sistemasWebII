const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');


// Route to handle game creation (assuming no change)
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
      // Send a successful response with status code 201 (Created)
      res.status(201).send({ message: 'Juego creado con éxito' }); // Informative message
    } else {
      console.error('Error creating game:', result);
      res.status(500).send({ message: 'Error al crear el juego' }); // Generic error message
    }
  } catch (err) {
    console.error('Error during game creation:', err);
    res.status(500).send({ message: 'Error al crear el juego' }); // Generic error message
  }
});

module.exports = router;
