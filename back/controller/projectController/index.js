const http = require('http');
let Router = require('./router');
const Mongo = require('mongodb').MongoClient;
const config = require('./config');
let MongoClient;

Mongo.connect(config.mongoUrl, (err, client) => {
    if (err) {
        console.error(err);
        process.exit(-1);
    }

    MongoClient = client.db('licentaDB');
    Router = Router.bind(null, MongoClient);
    http.createServer(Router).listen(3001, () => console.log('Uploader Web Service exposed on port 3001!'));
});


