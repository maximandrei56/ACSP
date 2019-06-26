const path = require('path');
const rimraf = require('rimraf');

module.exports = async function (MongoClient, req, res) {
    const {username, projectname, tag} = req.headers;
    const query = { tag };
    await MongoClient.collection('apps').remove(query);

    const resp ={
      'code': 0,
      'message': 'Success'
    };
    const dir = path.join(path.join(__dirname, '../../..'), path.join(req.headers.path, '..'));
    rimraf(dir, (err) => console.log('removed directory', err));
    res.writeHead(200, {"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json'});
    res.end(JSON.stringify(resp));
};
