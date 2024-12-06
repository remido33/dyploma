
const app = require('../api_server/src');
const host = '192.168.1.131';
const port = 4000;

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});