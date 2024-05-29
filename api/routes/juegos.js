const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

// Obtener juegos
router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit) {
    limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
  }
  let next = req.query.next;
  let query = {};
  if (next) {
    query = { _id: { $lt: new ObjectId(next) } };
  }
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection('juegos')
    .find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .toArray()
    .catch(err => res.status(400).send('Error al buscar juegos'));
  next = results.length === limit ? results[results.length - 1]._id : null;
  res.status(200).json({ results, next });
});

// Obtener juego por ID
router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = { _id: new ObjectId(req.params.id) };
  let result = await dbConnect.collection('juegos').findOne(query);
  if (!result) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(result);
  }
});

// Añadir juego
router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  let result = await dbConnect.collection('juegos').insertOne(req.body);
  res.status(201).send(result);
});

// Actualizar juego por ID
router.put('/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const update = {
    $set: {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      duracion: req.body.duracion
    }
  };
  const dbConnect = dbo.getDb();
  let result = await dbConnect.collection('juegos').updateOne(query, update);
  res.status(200).send(result);
});

// Eliminar juego por ID
router.delete('/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const dbConnect = dbo.getDb();
  let result = await dbConnect.collection('juegos').deleteOne(query);
  res.status(200).send(result);
});

module.exports = router;
