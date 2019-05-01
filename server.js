const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.options('*', cors());

app.use(express.static('./dist/stockchart'));

app.all('*', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
});