const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
const user = require('./models/user');
const userroutes = require('./routes/userRoutes');
const cors = require('cors');


mongoose.connect(process.env.DATABASE_URL)
  .then((result) => {
    console.log('Connected to the DataBase successfully');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/user', userroutes);

app.get('/', (req, res) => {    
    res.send('Hello World!');
}  );


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});


