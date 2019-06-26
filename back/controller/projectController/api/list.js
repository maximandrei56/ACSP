module.exports = async function (MongoClient, req, res) {
    const {username} = req.headers;
    const query = {username};
    const projects = (await MongoClient.collection('apps').find(query).toArray()).map((app) => {
        delete app._id;
        if (app.detect && app.detect.psalm && app.detect.psalm.length > 100) {
            app.detect.psalm = app.detect.psalm.slice(0, 50);
        }


        if (app.detect && app.detect.psecio && app.detect.psecio.length > 100) {
            app.detect.psecio = app.detect.psecio.slice(0, 50);
        }

        return app;
    });
    const resp = {
        projects,
        'message': 'Success'
    };

    res.writeHead(200, {"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json'});
    res.end(JSON.stringify(resp));
};
