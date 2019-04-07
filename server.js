const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors'); 
const PORT = process.env.PORT || 4200;

app.use(cors());

app.all('*', function(req, res, next) {
    var origin = req.get('origin'); 
    res.header('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static('./dist/stockchart'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/stockchart/index.html'));
});

app.listen(PORT, function(){
    console.log(`Server escuchando en el puerto ${PORT}`);
});