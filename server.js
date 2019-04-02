const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const  router = express.Router();
const PORT = process.env.PORT || 3000;


router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-Auth-Token, Accept");
    next();
})

app.use(express.static('./dist/stockchart'))

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/stockchart/index.html'));
});

app.listen(PORT, function(){
    console.log(`Server listener in port ${PORT}`);
});