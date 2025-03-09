require('dotenv').config()
const express = require("express");
const cors = require('cors')
const initMongo = require('./config/mongo')
const morgan = require('morgan')
const passport = require('passport')
const helmet = require('helmet')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(passport.initialize())
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors())
app.use('/api/', require('./routes'))

// Start server
app.listen(PORT);

initMongo();