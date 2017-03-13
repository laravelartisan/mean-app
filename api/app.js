const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

//const index = require('./routes/index');
const users = require('./routes/users');

const configDB = require('./config/database.js');
mongoose.connect(configDB.url);
mongoose.connection.on('connected',()=>{

    console.log('database connected');
});

mongoose.connection.on('error',(err)=>{

    console.log('database connected '+err );
});
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);

//authenticate
require('./config/passport')(passport);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("server started on port"+ port);
});

