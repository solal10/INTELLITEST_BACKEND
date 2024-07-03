const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
const userroutes = require('./routes/userRoutes');
const modelroutes = require('./routes/modelRoutes');
const idea = require('./routes/IdeasRoutes');


const cors = require('cors');


mongoose.connect(process.env.DATABASE_URL)
  .then((result) => {
    console.log('Connected to the DataBase successfully');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors()); // Enable preflight requests for all routes


app.use('/user', userroutes);
app.use('/idea', idea);
app.use('/model',modelroutes)

app.get('/', (req, res) => {    
    res.send('Hello World!');
}  );


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});


