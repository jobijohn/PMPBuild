/**
 * Created by appu on 4/10/16.
 */
var fs = require('fs');
/**
 * Function to read jsonissues file
 */
function readJsonFile(jsonFileName, callback){
    fs.readFile(jsonFileName, 'utf8', function (err, jsonData) {
        if (err) {
            callback(err, null);
        }
        var parsedJsonData = JSON.parse(jsonData);
        callback(null, parsedJsonData);
    });
}

/**
 * Function to get all unique issues from the json
 * @param jsonJiraProject - json returned from rest api
 * @returns {Array} - unique Issue Types
 */
function getAllUniqueIssueTypes(jsonJiraProject, callback) {
    var totalJiraIssues,
        issueTypes = [],
        uniqueIssueTypes = [];
    totalJiraIssues = jsonJiraProject.total;             // to get total issue count
    console.log('totalJiraIssues', totalJiraIssues);
    for (var i = 0; i < totalJiraIssues; i++) {
        issueTypes.push(jsonJiraProject.issues[i].fields.issuetype.name);       // To get all issue Types in the json
    }

    uniqueIssueTypes = issueTypes.filter(function (elem, index, self) {         // To get unique issue types from all issues
        return index == self.indexOf(elem);
    });
    callback(null, uniqueIssueTypes);
}

exports.readJsonFile = readJsonFile;
exports.getAllUniqueIssueTypes = getAllUniqueIssueTypes;