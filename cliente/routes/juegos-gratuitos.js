var express = require('express');
var router = express.Router();
const axios = require('axios');

const DEFAULT_PAGE_SIZE = 10; // Number of games per page

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get page number from query param (default 1)
  const pageSize = parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE; // Get page size from query param (default 10)

  try {
    const response = await axios.get('http://localhost:3010/api/v1/juegos-gratuitos');
    const allGames = response.data;

    const totalPages = Math.ceil(allGames.length / pageSize); // Calculate total pages

    const startIndex = (page - 1) * pageSize; // Calculate starting index for current page
    const endIndex = Math.min(startIndex + pageSize, allGames.length); // Calculate ending index (avoid out-of-bounds)
    const paginatedGames = allGames.slice(startIndex, endIndex); // Slice data for current page

    res.render('juegos-gratuitos', { juegos: paginatedGames, currentPage: page, totalPages });

  } catch (error) {
    console.error('Error al obtener los datos de la API de Gametrade:', error);
    res.status(500).send('Error al obtener los datos de la API de Gametrade');
  }
});

module.exports = router;
