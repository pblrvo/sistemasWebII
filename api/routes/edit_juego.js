const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

// Obtener información de un juego por ID para editar
router.get('/:_id', async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params._id) };
  
  try {
    const result = await dbConnect.collection('juegos').findOne(query);
    if (!result) {
      res.status(404).send("Juego no encontrado");
    } else {
      res.render('edit_juego', { juego: result, baseUri: process.env.BASE_URI || '/api/v1' });
    }
  } catch (err) {
    console.error('Error al obtener el juego para editar:', err);
    res.status(500).send('Error al obtener el juego para editar');
  }
});

// Guardar cambios en la información de un juego
router.post('/:_id', async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params._id) };
  const update = {
    $set: {
      name: req.body.name,
      short_description: req.body.short_description,
      price: req.body.price,
      release_date: req.body.release_date,
      categories: req.body.categories.split(','),
      genres: req.body.genres.split(',')
    }
  };

  try {
    const result = await dbConnect.collection('juegos').updateOne(query, update);
    if (result.matchedCount === 0) {
      res.status(404).send("Juego no encontrado para actualizar");
    } else {
      res.redirect(`${baseUri}/info_juego/${req.params._id}`);
    }
  } catch (err) {
    console.error('Error al actualizar el juego:', err);
    res.status(500).send('Error al actualizar el juego');
  }
});

module.exports = router;
