const express = require('express');
const getError = require('../../shared_utils/getError');
const verifyShopifyRequest = require('./helpers/verifyShopifyRequest');
const app = express();

app.use(
    '/store/:id/webhook',
    express.json({
        limit: '5mb',
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    }),
    (req, res, next) => {
        const verified = verifyShopifyRequest(req);
        if (!verified) 
            throw getError(403, 'Invalid HMAC signature')

        next();
    }
);


require('dotenv').config();
require('./cron/analytics/actions');
require('./cron/analytics/terms');
require('./cron/analytics/purchases');

app.use(express.json());

app.use('/store', require('./routes/store'));
app.use('/user', require('./routes/user'));
app.use('/analytics', require('./routes/analytics'));

app.all('*', (req, res) =>
    res.status(404).json(getError(404, 'Resource not found')));

app.use(require('../../shared_utils/errorHandler'));

module.exports = app;
