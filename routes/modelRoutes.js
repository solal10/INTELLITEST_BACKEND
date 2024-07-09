const express = require('express');
const router = express.Router();
const userFuncs = require('../controllers/modelController');

router.post('/newModel', userFuncs.addModel);

router.post('/deleteModel', userFuncs.deleteModel);

router.post('/getModel', userFuncs.getModel);

router.post('/getModels', userFuncs.getAllModels);

router.post('/update', userFuncs.updateModel);

router.post('/history', userFuncs.getModelHistory);

router.post('/startLearn',userFuncs.startLearn);

router.post('/finishLearn',userFuncs.finishLearn);


module.exports = router;
