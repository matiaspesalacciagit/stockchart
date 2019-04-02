const express = require('express');
const path = require('path');
const app = express();
var cors = require('cors'); 
app.use(cors());
//const router = express.Router();
const PORT = process.env.PORT || 4200;

/*
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-Auth-Token, Accept");
    next();
})*/

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

// const corsOptions = {
//     origin: 'https://api.invertironline.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
  
// app.get('/token', cors(corsOptions), function (req, res, next) {
//     res.json({msg: 'CORS habilitado solo para https://api.invertironline.com'})
// })

app.listen(PORT, function(){
    console.log(`Server escuchando en el puerto ${PORT}`);
});