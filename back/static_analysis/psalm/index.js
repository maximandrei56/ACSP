/**
 * PSALM LIBRARY USED TO DISPLAY SECURITY VULNERABILITIES.
 */

const child_process = require('child_process');
const exec = child_process.exec;
const async = require('async');
const fs = require('fs');
const path = require('path');
const detect_path = 'D:\\facultate\\licenta\\staticAnalysis\\psalm';

function psalm(targetDirectory, cb) {
    async.waterfall([
        (done) => {
            const executablePsecio = '.\\vendor\\bin\\psalm';
            const now = Date.now();
            exec(`${executablePsecio} --report=stats.json ${targetDirectory}`, {'cwd': detect_path}, (error, stdout, stderr) => {
                console.log('PSALM -------',  Date.now() - now, stdout, stderr);
                done(null, stdout);
            });
        },
        (stdout, done) => {
        return fs.readFile(path.join(detect_path, 'stats.json'), done);
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
            console.error('psalm', err);
            return cb(err);
        }
        // const obj = JSON.parse(res).results.map((el) => {
        //     el.file = path.relative(targetDirectory, el.file);
        //     return el;
        // });
        const obj = JSON.parse(res).map((el) => {
            return {
                'severity': el.severity,
                'file': path.relative(targetDirectory, el.file_path),
                'line': el.line_from,
                'line_to': el.line_to,
                'description': el.message,
                'source': el.snippet
            };
        });

        cb(null, obj);
    });
}

module.exports = psalm;

// psalm('D:\\facultate\\licenta\\projects\\admin\\l322\\src', () => {});
