const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

// Obtener información de un juego por ID
router.get('/:_id', async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params._id) };
  
  try {
    const result = await dbConnect.collection('juegos').findOne(query);
    if (!result) {
      res.status(404).send("Juego no encontrado");
    } else {
      res.render('info_juego', { juego: result, baseUri: process.env.BASE_URI || '/api/v1' });
    }
  } catch (err) {
    console.error('Error al obtener el juego:', err);
    res.status(500).send('Error al obtener el juego');
  }
});

// Eliminar un juego por ID
router.delete('/:_id', async (req, res) => { // Asegúrate de que esté usando 'router.delete()'
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params._id) };
  
  try {
    await dbConnect.collection('juegos').deleteOne(query);
    res.redirect('/api/v1/juegos');
  } catch (err) {
    console.error('Error al eliminar el juego:', err);
    res.status(500).send('Error al eliminar el juego');
  }
});

module.exports = router;
