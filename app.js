const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const database = require('./config/database');

mongoose
  .connect(database.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('connected to database: '+database.mongoURI))
  .catch(err => console.log(err));


// 
const app = express();

const users = require('./routes/users');

// port number
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize());
app.use(passport.session());
app.use('/users', users);


require('./config/passport')(passport);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid end point');
});

// start server
app.listen(port, () => {
    console.log('Server Started on port ' +port);
}); 