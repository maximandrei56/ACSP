/**
 * PSECIO LIBRARY USED TO DISPLAY SECURITY VULNERABILITIES.
 */

const child_process = require('child_process');
const exec = child_process.exec;
const async = require('async');
const fs = require('fs');
const path = require('path');
const detect_path = 'D:\\facultate\\licenta\\staticAnalysis\\psecio';

function psecio(targetDirectory, cb) {
    async.waterfall([
        (done) => {
            const now = Date.now();

            const executablePsecio = '.\\vendor\\bin\\psecio-parse';
            exec(`${executablePsecio} scan ${targetDirectory} --format=json > psecio-statistics.json`, {'cwd': detect_path}, (error, stdout, stderr) => {
                console.log('PSECIO -------', Date.now() - now, stdout, stderr);

                done(null, stdout);
            });
        },
        (stdout, done) => {
            return fs.readFile(path.join(detect_path, 'psecio-statistics.json'), done);
            try {
                const beauty = JSON.parse(stdout);
            } catch (err) {
                return done(err);
            }

            done(null, stdout);
            // fs.writeFile(`${__dirname}/psecio-statistics.json`, JSON.stringify(JSON.parse(stdout), null, 2), function(err) {
            //     if(err) {
            //         return done(err);
            //     }
            //
            //     console.log('psecio executed successfully');
            //     done();
            // });
        }
    ], (err, res) => {
        if (err) {
            console.error('psecio', err);
            return cb(err);
        }
        const obj = JSON.parse(res).results.map((el) => {
            el.file = path.relative(targetDirectory, el.file);
            return el;
        });

        cb(null, obj);
    });
}

module.exports = psecio;
