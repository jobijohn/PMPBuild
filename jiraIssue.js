/**
 * Created by jobi on 10/8/16.
 */

var async =  require('async'),
    fs = require('fs'),
    child_process = require('child_process');
function renderForm(req, res) {
    res.render('jiraIssue');
}

function randomFileName() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

function createJiraIssue(req, res) {
    var issueType = req.param('ap-issuetype');
    var district = req.param('ap-district');
    var taluk = req.param('ap-taluk');
    var acres = req.param('ap-acres');
    console.log('console ', issueType, district, taluk, acres);
    var randomFile  = randomFileName();
    randomFile = randomFile + '.json';
    async.waterfall([
        function (callback) {
            fs.writeFile(randomFile, '{"fields":{"project":{"id":"10000"}}}', function (err) {
                if (err) return console.log(err);
                console.log('File Created -', randomFile);
                callback(null, randomFile);
            });
        },
        function (randomFile, callback) {
            var obj = require("./"+ randomFile.toString());
            obj.fields.summary = "Check Insert";
            fs.writeFile('./' + randomFile, JSON.stringify(obj), function (err) {
                callback(null, randomFile);
            });
        },
        function (randomFile, callback) {
            function runCmd(cmd)
            {
                var resp = child_process.execSync(cmd);
                var result = resp.toString('UTF8');
                return result;
            }

            var cmd = "curl -u jobikjohn:jkjjkj -X POST --data @" + randomFile + "-H 'Content-Type: application/json' https://swarmact.atlassian.net/rest/api/2/issue/";
            var result = runCmd(cmd);
            callback(null, randomFile);
        },
        function (randomFile, callback) {
            // fs.unlink(randomFile, function (err) {
                callback(null, randomFile);
            // });
        }
        ],function (err, result) {
            console.log('File Removed -', result);
    });
}

exports.renderForm = renderForm;
exports.createJiraIssue = createJiraIssue;