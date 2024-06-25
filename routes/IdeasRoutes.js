const express = require('express');
const router = express.Router();
const ideaFuncs = require('../controllers/contribute');

router.post('/addIdea', ideaFuncs.addIdea);

module.exports = router;
