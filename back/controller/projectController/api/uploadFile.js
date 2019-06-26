const formidable = require('formidable');
const async = require('async');
const path = require('path');
const mv = require('mv');
const fs = require('fs');
const extractZip = require('extract-zip');
const PortManager = require('../portManager');
const dockerSetup = require('../dockerSetup');
const detections = require('../../../staticAnalysis/index');

module.exports = async function (MongoClient, req, res) {
    const globalTime = Date.now();
    const {username, projectname, psalm = 0, psecio = 0, phploc = 0} = req.headers;
    const portManager = new PortManager({'dbClient': MongoClient});

    let app_port = -1;
    let webgrind_port = -1;

    async.waterfall([
        async () => {
            // FIRST LIST USER'S PROJECTS
            const query = {username, 'name': projectname};
            const projects = (await MongoClient.collection('apps').find(query).toArray()).map((app) => app.name);
            if (projects.length > 0) {
                throw {
                    'code': 1000,
                    'message': 'Project name already exists'
                };
            }
        },
        (st, done) => {
            // PARSE INPUT

            let form = new formidable.IncomingForm();

            form.parse(req, function (err, fields, files) {
                if (err) {
                    const error = {
                        'message': err,
                        'code': 1001
                    };

                    return done(error);
                }

                if (!files.file || !files.file.name || !files.file.name.endsWith('.zip')) {
                    const error = {
                        'message': 'Invalid file format. (Zip only)',
                        'code': 1001
                    };

                    return done(error);
                }

                return done(null, files, files.file.name);
            });
        },
        (files, filename, done) => {
            // SAVE FILE LOCALLY

            let targetDir = path.join(__dirname, `../../../projects/${username}/`);

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir);
            }

            targetDir = path.join(targetDir, `/${projectname}`);

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir);
            }

            let oldpath = files.file.path;
            let newpath = path.join(targetDir, `/${files.file.name}`);

            mv(oldpath, newpath, function (err) {
                if (err) {
                    const error = {
                        'message': err,
                        'code': 1002
                    };

                    return done(error);
                }

                return done(null, newpath, filename);
            });
        },
        (zipPath, filename, done) => {
            // UNZIP THE PROJECT

            const targetDir = path.join(zipPath, '/..');

            extractZip(zipPath, {'dir': targetDir}, (err) => {
                if (err) {
                    const error = {
                        'message': 'Error unzipping. Uploaded file may be corrupted.',
                        'code': 1003
                    };

                    return done(error);
                }
                setTimeout(() => done(null, targetDir, filename), 100);
            });
        },
        (targetDir, filename, done) => {
            // CREATE SRC FOLDER

            const oldDir = filename.split('.')[0];
            const oldPath = path.join(targetDir, oldDir);
            const newPath = path.join(targetDir, 'src');

            mv(oldPath, newPath, function (err) {
                if (err) {
                    const error = {
                        'message': err,
                        'code': 1002
                    };

                    return done(error);
                }

                return done(null, targetDir);
            });

        },
        async (targetDir) => {
            app_port = await portManager.findPort();
            webgrind_port = await portManager.findPort(app_port);

            if (app_port === -1 || webgrind_port === -1) {
                const error = {
                    'message': 'Cannot get valid port',
                    'code': 1010
                };

                throw error;
            }

            return targetDir;
        },
        (targetDir, done) => {
            // ADD DOCKER_SETUP
            const newPath = path.join(targetDir, 'src');
            const oldPath = path.join(__dirname, '../../../docker_setup/');

            let o1 = path.join(oldPath, 'docker-compose.yml');
            let o2 = path.join(newPath, 'docker-compose.yml');
            let o11 = path.join(oldPath, 'xdebug.ini');
            let o22 = path.join(newPath, 'xdebug.ini');
            let o111 = path.join(oldPath, 'Dockerfile');
            let o222 = path.join(newPath, 'Dockerfile');

            dockerSetup(app_port, webgrind_port, o2);
            fs.createReadStream(o11).pipe(fs.createWriteStream(o22));
            fs.createReadStream(o111).pipe(fs.createWriteStream(o222));

            setTimeout(() => done(null, targetDir), 100);
        }
    ], (err, targetDir) => {
        console.log('Request finished!');

        if (err) {
            console.error(err);
            res.writeHead(501, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(err));
            return;
        }

        const resp = {
            'code': 0,
            'message': 'Success'
        };
        const update = {
            'name': projectname,
            'path': path.relative(path.join(__dirname, '../../..'), path.join(targetDir, 'src')),
            'status': 'not running',
            'username': username,
            'tag': `${username}_${projectname}`,
            'app_port': app_port,
            'webgrind_port': webgrind_port,
            'app_expose': `http://localhost:${app_port}`,
            'webgrind_expose': `http://localhost:${webgrind_port}`,
            'detect': {}
        };

        MongoClient.collection('apps').insertOne(update);

        const pth = path.join(targetDir, 'src');

        const time = {};

        detections({psecio, psalm, phploc}, pth , (result, done) => {
            const analysis = `detect.${result.key}`;
            time[result.timeKey] = result.time;

            MongoClient.collection('apps').updateOne({'tag': `${username}_${projectname}`}, {
                '$set': {
                    [analysis]: result.result
                }
            }, () => done());
        }, () => {
            MongoClient.collection('logs').insertOne({
                'operation': 'create',
                'name': projectname,
                'time': globalTime,
                'expandValue': time
            });

            res.writeHead(200, {"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json'});
            res.end(JSON.stringify(resp));
        });
    });
};

