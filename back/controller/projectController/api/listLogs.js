module.exports = async function (MongoClient, req, res) {
    const projects = (await MongoClient.collection('logs').find().toArray()).map((log) => {
        delete log._id;
        return log;
    });

    res.writeHead(200, {"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json'});
    res.end(JSON.stringify(projects));
};
