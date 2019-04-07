let express = require('express'),
cors = require('cors'),
os = require('os'),
app = express(),
PORT = process.env.PORT || 4200;
 
// hard coded configuration object
conf = {
  
    originUndefined: function (req, res, next) {
 
        if (!req.headers.origin) {
 
            res.json({
 
                mess: 'Hi you are visiting the service locally. If this was a CORS the origin header should not be undefined'
 
            });
 
        } else {
 
            next();
 
        }
 
    },
 
    // Cross Origin Resource Sharing Options
    cors: {
 
        // origin handler
        origin: function (origin, cb) {
 
            // setup a white list
            let wl = ['https://api.invertironline.com'];
 
            if (wl.indexOf(origin) != -1) {
 
                cb(null, true);
 
            } else {
 
                cb(new Error('invalid origin: ' + origin), false);
 
            }
 
        },
 
        optionsSuccessStatus: 200
 
    }
 
};
 
// use origin undefined handler, then cors for all paths
app.use(conf.originUndefined, cors(conf.cors));
 
// get at root
app.get('/', function (req, res, next) {
    res.json({
        mess: 'hello it looks like you are on the whitelist',
        origin: req.headers.origin,
        os_hostname: os.hostname(),
        os_cpus: os.cpus()
    });
 
});
 

app.use(express.static('./dist/stockchart'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/stockchart/index.html'));
});

app.listen(PORT, function(){
    console.log(`Server escuchando en el puerto ${PORT}`);
});