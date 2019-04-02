const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4200;

app.use(express.static('./dist/stockchart'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/stockchart/index.html'));
});

app.listen(PORT, function(){
    console.log(`Server listener in port ${PORT}`);
});