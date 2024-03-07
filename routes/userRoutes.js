const express = require('express');
const router = express.Router();
const userFuncs = require('../controllers/userController');

router.post('/register', userFuncs.registerUser);

router.post('/login', userFuncs.loginUser);

router.post('/edit', userFuncs.editUser);

router.post('/delete', userFuncs.deleteUser);

router.post('/get', userFuncs.getUser);

router.post('/getModels', userFuncs.getUserModels);




module.exports = router;
