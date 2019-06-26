const http = require("http");
const Mongo = require('mongodb').MongoClient;
const config = require('./config');
let Router = require('./router');
let MongoClient;

Mongo.connect(config.mongoUrl, (err, client) => {
    if (err) {
        console.error(err);
        process.exit(-1);
    }

    MongoClient = client.db('licentaDB');
    Router = Router.bind(null, MongoClient);
    http.createServer(Router).listen(3000, () => console.log('Docker Web Service exposed on port 3000!'));
});
