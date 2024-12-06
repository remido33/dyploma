
const express = require('express');
const getError = require("../../shared_utils/getError");
const app = express();

require('dotenv').config();

app.use(express.json());
app.use('/store', require('./routes/store'));
app.use('/analytics', require('./routes/analytics'));

app.all('*', (req, res) =>
    res.status(404).json(getError(404, 'Resource not found')));

app.use(require('../../shared_utils/errorHandler'));

module.exports = app;