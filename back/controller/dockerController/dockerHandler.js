const child_process = require('child_process');
const exec = child_process.exec;
const async = require('async');
const path = require('path');

const base_path = path.join(__dirname, '../..');

module.exports = {
    'restart': function (MongoClient, tagInfo, callback) {
        const dirPath = path.join(base_path, tagInfo.path);

        return exec(`docker-compose restart`, {'cwd': dirPath, 'timeout': 3000}, (error, stdout, stderr) => {
            if (error && error.signal === 'SIGTERM') {
                // BUILDED IMAGE
                callback();
            } else {
                console.error(`exec error: ${error}`);
                return callback(error);
            }

        });
    },
    'run': function (MongoClient, tagInfo, callback) {
        const dirPath = path.join(base_path, tagInfo.path);

        return exec(`docker-compose up -d`, {'cwd': dirPath}, (error, stdout, stderr) => {
            if (error && error.signal === 'SIGTERM') {

                console.error(`exec error: ${error}`);
                return callback(error);

            } else {
                const update = {
                    '$set': {
                        // 'last_update': Date.now(),
                        'status': 'running'
                    }
                };
                MongoClient.collection('apps').updateOne({'tag': tagInfo.tag}, update, {'upsert': true});
                return callback();
            }

        });
    },
    'destroy': function (MongoClient, tagInfo, callback) {
        const dirPath = path.join(base_path, tagInfo.path);

        exec(`docker-compose down -v --rmi=local`, {'cwd': dirPath}, (error, stdout, stderr) => {
            if (error && error.signal === 'SIGTERM') {
                console.error(`exec error: ${error}`);
                return callback(error);
            }
            console.log(stdout, stderr);
            exec(`docker-compose down -v --rmi=local`, {'cwd': dirPath}, (e, s, er) => {console.log('\nqwewqewqewqewq', s, er)});
            const update = {
                '$set': {
                    // 'last_update': Date.now(),
                    'status': 'not running'
                }
            };
            MongoClient.collection('apps').updateOne({'tag': tagInfo.tag}, update, {'upsert': true});
            callback(null, stdout);
        });
    },
    'stop': function (MongoClient, tagInfo, callback) {
        const dirPath = path.join(base_path, tagInfo.path);

        exec(`docker-compose stop`, {'cwd': dirPath}, (error, stdout, stderr) => {
            if (error && error.signal === 'SIGTERM') {
                console.error(`exec error: ${error}`);
                return callback(error);
            }

            const update = {
                '$set': {
                    // 'last_update': Date.now(),
                    'status': 'not running'
                }
            };
            MongoClient.collection('apps').updateOne({'tag': tagInfo.tag}, update, {'upsert': true});
            callback(null, stdout);
        });
    }
};
