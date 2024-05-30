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

  res.render('juegos', { results, next, prev });
});

// Obtener datos externos en formato XML
router.get('/noticias', async (req, res) => {
  try {
    const count = req.query.count || 3;
    const currentOffset = Math.floor(Date.now() / 1000); // Obtener la fecha y hora actual en segundos
    const response = await axios.get(`http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=${count}&maxlength=300&format=xml&enddate=${currentOffset}`);
    const jsonData = parser.toJson(response.data, { object: true });
    res.render('informacion-externa', { data: jsonData, offset: currentOffset });
  } catch (error) {
    console.error('Error al obtener los datos de la API externa:', error);
    res.status(500).send('Error al obtener los datos de la API externa');
  }
});

// Obtener juegos gratuitos
router.get('/juegos-gratuitos', async (req, res) => {
  try {
    const response = await axios.get('https://www.freetogame.com/api/games');
    const juegos = response.data;

    res.render('juegos-gratuitos', { juegos });
  } catch (error) {
    console.error('Error al obtener los datos de la API de FreeToGame:', error);
    res.status(500).send('Error al obtener los datos de la API de FreeToGame');
  }
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
