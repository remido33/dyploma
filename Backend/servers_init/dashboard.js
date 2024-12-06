
const app = require('../dashboard_server/src');
const host = '192.168.1.131'; // 192.168.1.131
const port = 4001;

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});