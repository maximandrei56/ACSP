const dockerHandler = require('./dockerHandler');

module.exports = async function Router(MongoClient, req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {"Access-Control-Allow-Origin": "*"});
        res.end();
        return;
    }

    const now = Date.now();
    const tag = req.url.split('/tag=')[1];
    const tagInfo = await MongoClient.collection('apps').findOne({'tag': tag});

    if (req.url.indexOf('/run') === 0) {
        dockerHandler.run(MongoClient, tagInfo, (err, result) => {
            if (err) {
                console.error(err);
                res.writeHead(501, {"Content-Type": "plain/text", "Access-Control-Allow-Origin": "*"});
                res.end('ERROR');
                return;
            }

            res.writeHead(200, {"Content-Type": "plain/text", "Access-Control-Allow-Origin": "*"});
            res.end('CONTAINER STARTED');
        });


    } else if (req.url.indexOf('/stop') === 0) {
        dockerHandler.stop(MongoClient, tagInfo, (err, result) => {
            if (err) {
                console.error(err);
                res.writeHead(501, {"Content-Type": "plain/text", "Access-Control-Allow-Origin": "*"});
                res.end('ERROR');
                return;
            }

            res.writeHead(200, {"Content-Type": "plain/text", "Access-Control-Allow-Origin": "*"});
            res.end('CONTAINER KILLED');
        });
    } else if (req.url.indexOf('/restart') === 0) {
        dockerHandler.restart(MongoClient, tagInfo, (err, result) => {
            if (err) {
                console.error(err);
                res.writeHead(501, {"Content-Type": "plain/text", "Access-Control-Allow-Origin": "*"});
                res.end('ERROR');
                return;
            }

            res.writeHead(200, {"Content-Type": "plain/text", "Access-Control-Allow-Origin": "*"});
            res.end('OK');
        });
    }else if (req.url.indexOf('/destroy') === 0) {
        dockerHandler.destroy(MongoClient, tagInfo, (err, result) => {
            MongoClient.collection('logs').insertOne({
                'name': tagInfo.name,
                'operation': 'remove',
                'time': now,
                'expandValue': {
                    'total time': Date.now() - now
                }
            });

            if (err) {
                console.error(err);
                res.writeHead(501, {"Content-Type": "plain/text", "Access-Control-Allow-Origin": "*"});
                res.end('ERROR');
                return;
            }



            res.writeHead(200, {"Content-Type": "plain/text", "Access-Control-Allow-Origin": "*"});
            res.end('OK');
        });
    }
};
