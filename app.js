const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const indexRouter = require('./routes/index');
const featuresRouter = require('./routes/features');
const cors = require('cors');
const nocache = require("nocache");
const compression = require("compression");
const helmet = require("helmet");
const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const dev_db_url = process.env.DEV_DB_URL;
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const emitter = require('./twitter/twitterServer');
const debug = require("debug")("app");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: 'https://www.power-map.io' }));
app.use(nocache());
/*app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
}));*/

app.use('/', indexRouter);
app.use('/api/v1/features', featuresRouter);
// sse
app.get('/stream', (req, res, next) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      };
    res.writeHead(200, headers);
    res.write(`data: connected to sse\n\n`);
    res.flush();
    emitter.on('new-feature',() => {
        debug(`A new-feature event has been detected.`);
        res.write(`data: new feature added\n\n`);
        res.flush();
    });
});

module.exports = app;
