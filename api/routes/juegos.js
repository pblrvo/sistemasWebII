const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS, 10);

// Obtener juegos
router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit) {
    limit = Math.min(parseInt(req.query.limit, 10), MAX_RESULTS);
  }
  let next = req.query.next;
  let prev = req.query.prev;
  let query = {};
  let search = req.query.search;

  if (next) {
    query = { _id: { $lt: new ObjectId(next) } };
  } else if (prev) {
    query = { _id: { $gt: new ObjectId(prev) } };
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
  }

  console.log('Query:', query); // Log del query

  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection('juegos')
    .find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .toArray()
    .catch(err => {
      console.error('Error al buscar juegos:', err);
      res.status(400).send('Error al buscar juegos');
    });

  console.log('Results:', results); // Log de los resultados

  next = results.length === limit ? results[results.length - 1]._id : null;
  const hasMore = await dbConnect.collection('juegos').countDocuments({ _id: { $gt: results[results.length - 1]._id } }) > 0;
  prev = hasMore ? results[0]._id : null;

  res.json({ results, next, prev });
});

// Obtener juego por nombre
router.get('/:name', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = { name: req.params.name };
  let result = await dbConnect.collection('juegos').findOne(query);
  if (!result) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(result);
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
