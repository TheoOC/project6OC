const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauces');
const userRoutes = require ('./routes/auth');

//connect to database
mongoose.connect('mongodb+srv://admin:admin1234@cluster0.woshq.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('successfully connected to mongoDB!'))
    .catch((error) => console.log('failed to connect to mongoDB!'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//parse body of request
app.use(bodyParser.json());

app.use('/api/auth',userRoutes);
app.use('/api/sauces',sauceRoutes);

module.exports = app;