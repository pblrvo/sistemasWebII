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
      res.json(result);
    }
  } catch (err) {
    console.error('Error al obtener el juego para editar:', err);
    res.status(500).send('Error al obtener el juego para editar');
  }
});

// Guardar cambios en la información de un juego
router.post('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  console.log("Update query:", query)
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
      res.status(200).send({ message: 'Juego editado con éxito' });
    }
  } catch (err) {
    console.error('Error al actualizar el juego:', query);
    res.status(500).send('Error al actualizar el juego', query);
  }
});

module.exports = router;
