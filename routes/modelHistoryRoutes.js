const express = require('express');
const router = express.Router();
const userFuncs = require('../controllers/modelHistoryController');

router.post('/addHistory', userFuncs.addModelHistory);
router.post('/history', userFuncs.getLastHistory);
router.post('/getAllHistory', userFuncs.getAllHistory);
module.exports = router;
