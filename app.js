const express = require('express');
//body parser to be able to extract JSON objects from POST request from the front end
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/auth');
//path to work with files and directory path
const path = require('path');
//load env variables
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

//connect to database
mongoose.connect(process.env.MONGOOSECLUSTER,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('successfully connected to mongoDB!'))
  .catch((error) => console.log('failed to connect to mongoDB!'));

const app = express();

//enable access to API from any origin and avoid Cross Origin Ressource Sharing errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//body parser as global middleware
app.use(bodyParser.json());
//set the routes
//tell express to manage the images ressources statically 
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;