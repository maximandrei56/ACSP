/**
 * PHPLOC LIBRARY USED TO DISPLAY PROJECT'S INFORMATION.
 */

const child_process = require('child_process');
const exec = child_process.exec;
const async = require('async');
const fs = require('fs');
const path = require('path');
const detect_path = 'D:\\facultate\\licenta\\staticAnalysis\\phploc';

function phploc(targetDirectory, cb) {
    async.waterfall([
        (done) => {
            const executablePhpLoc = path.join(__dirname, '..\\vendor\\bin\\phploc --log-json phploc-statistics.json');
            exec(`${executablePhpLoc} ${targetDirectory}`, {'cwd': detect_path}, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return done(error);
                }
                done(null, stdout);
            });
        },
        (stdout, done) => {
        // fs.writeFile(`${__dirname}/phploc-statistics.txt`, stdout, function (err) {
        //         if (err) {
        //             return done(err);
        //         }
        //
        //
        //     });
        // fs.readFile(path.join(detect_path, 'phploc-statistics.json'), done);
            // const result = 'Metrics:\n\n' + (stdout.substring(stdout.indexOf('Size\n'))).trim();
            return done(null, stdout);
        }
    ], (err, res) => {
        if (err) {
            return cb(err);
        }

        const lg = res.length;
        let text = res.substr(res.indexOf('\n')+1).substr(1);
        const obj = [];
        while (1) {
            const end = text.indexOf('\n');

            if (end < 0) {
                obj.push(text);
                break;
            }

            obj.push(text.substring(0, text.indexOf('\n')));
            text = text.substr(text.indexOf('\n') + 1);
        }

        let id = 0;
        const ierarhie = [];
        const newp = [];

        const stats = {};

        obj.forEach((el) => {
            if (el.length === 0) {
                return;
            }

            const arr = el.split(" ").reverse();
            const krr = el.split(' ');
            let num = 0;

            for(let k of krr) {
                if (k.length === 0) {
                    num++;
                }
                else {
                    break;
                }
            }
            const g = {
              'cnt': num
            };

            if (arr.length > 2) {
                let nr = (arr[1].length === 0) ? '' : (arr[1] + ' ');

                nr += arr[0];

                ierarhie.push(nr);
                arr[0] = '';
                arr[1] = '';
                g.name = '';

                for (let x of arr.reverse()) {
                    if (x.length > 0) {
                        g.name = g.name + ' ' +  x;
                    }
                }
                if (g.name.length > 2) {
                    stats[g.name] = nr;
                }
                g.name = g.name + ': ' + nr;
            } else {
                g.name = el.trim();
            }

            g.id = id;
            newp.push(g);
            id++;
        });

        const irz = [];
        populate(irz, 0, newp);

        cb(null, irz, stats);
    });
}

module.exports = phploc;

function populate(root, cnt, arr) {
    for (let idx = 0; idx < arr.length; ++idx) {
        const doc = arr[idx];

        if (doc.cnt < cnt) {
            break;
        }
        if (doc.cnt === cnt) {
            if (idx + 1 < arr.length && arr[idx + 1].cnt > arr[idx].cnt) {
                doc.children = [];
                populate(doc.children, arr[idx + 1].cnt, arr.slice(idx + 1));
            }
            root.push(doc);
        }
    }
}
