const express = require('express');
const router = express.Router();
const userFuncs = require('../controllers/modelController');

router.post('/addHistory', userFuncs.addModelHistory);