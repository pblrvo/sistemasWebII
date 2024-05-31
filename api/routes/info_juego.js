const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

// Obtener información de un juego específico
router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const juego = await dbConnect.collection('juegos').findOne(query);
    if (!juego) {
      return res.status(404).send('Juego no encontrado');
    }
    res.render('info_juego', { juego });
  } catch (error) {
    console.error('Error al obtener el juego:', error);
    res.status(500).send('Error al obtener el juego');
  }
});

// Eliminar un juego
router.delete('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await dbConnect.collection('juegos').deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).send('Juego no encontrado');
    }
    res.redirect('/api/v1/juegos');
  } catch (error) {
    console.error('Error al eliminar el juego:', error);
    res.status(500).send('Error al eliminar el juego');
  }
});

// Editar un juego (formulario)
router.get('/:id/edit', async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const juego = await dbConnect.collection('juegos').findOne(query);
    if (!juego) {
      return res.status(404).send('Juego no encontrado');
    }
    res.render('edit_juego', { juego });
  } catch (error) {
    console.error('Error al obtener el juego para editar:', error);
    res.status(500).send('Error al obtener el juego para editar');
  }
});

// Actualizar un juego
router.put('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  const update = {
    $set: {
      name: req.body.name,
      short_description: req.body.short_description,
      price: req.body.price,
      release_date: req.body.release_date,
      categories: req.body.categories.split(',').map(category => category.trim()),
      genres: req.body.genres.split(',').map(genre => genre.trim()),
    },
  };

  try {
    const result = await dbConnect.collection('juegos').updateOne(query, update);
    if (result.matchedCount === 0) {
      return res.status(404).send('Juego no encontrado');
    }
    res.redirect(`/api/v1/juego/${req.params.id}`);
  } catch (error) {
    console.error('Error al actualizar el juego:', error);
    res.status(500).send('Error al actualizar el juego');
  }
});

module.exports = router;
