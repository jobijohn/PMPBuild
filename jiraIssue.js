/**
 * Created by jobi on 10/8/16.
 */

var common =  require('./common'),
    async =  require('async'),
    fs = require('fs'),
    child_process = require('child_process');
function renderForm(req, res) {
    var indexData = {};
    var issueJsonFile = 'jiraissues.json';
    common.readJsonFile(issueJsonFile, function (err, issueData) {
    common.getAllUniqueDistricts(issueData, function (err, districts) {
        indexData.districts = districts;
        common.getAllUniqueTaluks(issueData, function (err, taluks) {
            indexData.taluks = taluks;
            res.render('jiraIssue', {indexData:indexData});
        });
    });
    });

}

function randomFileName() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

function createJiraIssue(req, res) {
    var issueType = req.param('ap-issuetype');
    var summary = req.param('ap-summary');
    var name = req.param('ap-name');
    var district = req.param('ap-district');
    var taluk = req.param('ap-taluk');
    var seedName = req.param('ap-seed-name');
    var seedQty = req.param('ap-seed-qty');
    var acres = req.param('ap-acres');
    //console.log('console ', issueType, district, taluk, acres);
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
            obj.fields.issuetype = {};
            obj.fields.issuetype.id = parseInt(issueType);
            obj.fields.summary = summary;

            obj.fields.customfield_10400 = {};
            obj.fields.customfield_10400.value = district;

            obj.fields.customfield_10401 = {};
            obj.fields.customfield_10401.value = taluk;

            obj.fields.customfield_10404 = {};
            obj.fields.customfield_10404.value = seedName;

            obj.fields.customfield_10405 = parseInt(seedQty);
            obj.fields.customfield_10403 = parseInt(acres);

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

            var cmd = "curl -u jobikjohn:jkjjkj -X POST --data @" + randomFile.toString() + " -H 'Content-Type: application/json' https://swarmact.atlassian.net/rest/api/2/issue/";
            var result = runCmd(cmd);

            console.log('randomFile:' + randomFile);
            console.log('result:' + result);
            callback(null, randomFile);
        },
        function (randomFile, callback) {
             fs.unlink(randomFile, function (err) {
                callback(null, randomFile);
             });
        }
        ],function (err, result) {
            //console.log('File Removed -', result);
            if(err){
                res.send({success:false});
            } else {
                res.send({success:true});
            }

    });
}

exports.renderForm = renderForm;
exports.createJiraIssue = createJiraIssue;