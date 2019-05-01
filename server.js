const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.options('*', cors());

const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();
const serverOne = 'https://api.invertironline.com';

app.use(express.static('./dist/stockchart'));

app.all('*', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
});

app.all("/token/*", function(req, res) {
  console.log('redirecting to serverOne');
  apiProxy.web(req, res, {target: serverOne});
});

app.all("/api/v2/*", function(req, res) {
  console.log('redirecting to serverOne');
  apiProxy.web(req, res, {target: serverOne});
});


const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
});