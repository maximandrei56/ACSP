const upload = require('./api/uploadFile');
const list = require('./api/list');
const listLogs = require('./api/listLogs');
const remove = require('./api/remove');


module.exports = async function Router(MongoClient, req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*"});
        res.end();
        return;
    }

    console.log('Request started!');

    switch (req.url) {
        case "/fileUpload":
            return upload(MongoClient, req, res);
        case "/listProjects":
            return list(MongoClient, req, res);
        case "/deleteProject":
            return remove(MongoClient, req, res);
        case "/listLogs":
            return listLogs(MongoClient, req, res);
        default:
            res.writeHead(404);
            res.end();
            return;

    }
};

