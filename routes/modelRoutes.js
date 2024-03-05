const express = require('express');
const router = express.Router();
const userFuncs = require('../controllers/modelController');

router.post('/newModel', userFuncs.registerUser);

router.post('/login', userFuncs.loginUser);

module.exports = router;
