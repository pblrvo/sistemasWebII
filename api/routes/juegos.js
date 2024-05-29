const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const axios = require('axios');
const parser = require('xml2json');
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
  if (next) {
    query = { _id: { $lt: new ObjectId(next) } };
  } else if (prev) {
    query = { _id: { $gt: new ObjectId(prev) } };
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
  const hasMore = await dbConnect.collection('juegos').countDocuments({ _id: { $gt: results[results.length - 1]._id } }) > 0;
  prev = hasMore ? results[0]._id : null;

  res.render('juegos', { results, next, prev });
});

router.get('/informacion-externa-xml', async (req, res) => {
  try {
    // Hacer una solicitud a la API externa que devuelve datos en formato XML
    const response = await axios.get('http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=3&maxlength=300&format=xml');

    // Convertir los datos XML en JSON
    const jsonData = parser.toJson(response.data, { object: true });

    // Aquí podrías procesar los datos como desees y enviarlos como respuesta
    res.json(jsonData);
  } catch (error) {
    console.error('Error al obtener los datos de la API externa:', error);
    res.status(500).send('Error al obtener los datos de la API externa');
  }
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