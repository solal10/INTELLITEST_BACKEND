const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
const user = require('./models/user');
mongoose.connect(process.env.DATABASE_URL)
const db =mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to database'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {    
    res.send('Hello World!');
}  );


app.post('/users', async (req, res) => {
    try {
      const { email, password, accountType } = req.body;
      const newUser = new user({
        Email: email,
        Password: password,
        accountType: accountType
      });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});


