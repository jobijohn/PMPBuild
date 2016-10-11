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

    for (var i = 0; i < totalJiraIssues; i++) {
        issueTypes.push(jsonJiraProject.issues[i].fields.issuetype.name);       // To get all issue Types in the json
    }

    uniqueIssueTypes = issueTypes.filter(function (elem, index, self) {         // To get unique issue types from all issues
        return index == self.indexOf(elem);
    });

    for (var j = 0;j<uniqueIssueTypes.length;j++) {
        uniqueIssueTypes[j] = {issuetype:uniqueIssueTypes[j]};
    }
    callback(null, uniqueIssueTypes);
}

/**
 * Function to get all unique districts from the json
 * @param jsonJiraProject - json returned from rest api
 * @returns {Array} - unique Issue Types
 */
function getAllUniqueDistricts(jsonJiraProject, callback) {
    var totalJiraIssues,
        districts = [],
        uniqueDistricts = [];

    totalJiraIssues = jsonJiraProject.total;

    for (var i = 0; i < totalJiraIssues; i++) {
        if(jsonJiraProject.issues[i].fields.customfield_10301) {
            districts.push(jsonJiraProject.issues[i].fields.customfield_10301.value);
        }
    }

    uniqueDistricts = districts.filter(function (elem, index, self) {         // To get unique issue types from all issues
        return index == self.indexOf(elem);
    });

    for (var j = 0;j<uniqueDistricts.length;j++) {
        uniqueDistricts[j] = {districts:uniqueDistricts[j]};
    }
    callback(null, uniqueDistricts);
}

/**
 * Function to get all unique taluks from the json
 * @type {readJsonFile}
 */
function getAllUniqueTaluks(jsonJiraProject, callback) {
    var totalJiraIssues,
        taluks = [],
        uniqueTaluks = [];

    totalJiraIssues = jsonJiraProject.total;

    for (var i = 0; i < totalJiraIssues; i++) {
        if(jsonJiraProject.issues[i].fields.customfield_10302) {
            taluks.push(jsonJiraProject.issues[i].fields.customfield_10302.value);
        }
    }

    uniqueTaluks = taluks.filter(function (elem, index, self) {         // To get unique issue types from all issues
        return index == self.indexOf(elem);
    });

    for (var j = 0;j<uniqueTaluks.length;j++) {
        uniqueTaluks[j] = {taluks:uniqueTaluks[j]};
    }
    callback(null, uniqueTaluks);
}

/**
 * Function to get all jira issues
 * @param jsonJiraProject
 * @param callback
 */
function getAllIssues(jsonJiraProject, callback) {
    var totalJiraIssues = jsonJiraProject.total;
    var issuesselectedFields = [];
    for(var i=0 ; i<totalJiraIssues ; i++){
        var issue = {};
        issue.issueType = jsonJiraProject.issues[i].fields.issuetype.name;
        issue.summary = jsonJiraProject.issues[i].fields.summary;
        issue.created = jsonJiraProject.issues[i].fields.created;
        if(jsonJiraProject.issues[i].fields.customfield_10400) {
            issue.district = jsonJiraProject.issues[i].fields.customfield_10400.value;
        } else {
            issue.district = "";
        }
        if(jsonJiraProject.issues[i].fields.customfield_10401) {
            issue.taluk = jsonJiraProject.issues[i].fields.customfield_10401.value;
        } else {
            issue.taluk = "";
        }
        issue.status = jsonJiraProject.issues[i].fields.status.name;
        if(jsonJiraProject.issues[i].fields.customfield_10404) {
            issue.seedName = jsonJiraProject.issues[i].fields.customfield_10404.value
            ;
        } else {
            issue.seedName = "";
        }
        if(jsonJiraProject.issues[i].fields.customfield_10405) {
            issue.seedquantity = jsonJiraProject.issues[i].fields.customfield_10405;
        } else {
            issue.seedQuantity = 0;
        }
        if(jsonJiraProject.issues[i].fields.customfield_10402) {
            issue.customer = jsonJiraProject.issues[i].fields.customfield_10402;
        } else {
            issue.customer=""
        }
        issuesselectedFields.push(issue);
    }
    callback(null, issuesselectedFields);
}
exports.readJsonFile = readJsonFile;
exports.getAllUniqueIssueTypes = getAllUniqueIssueTypes;
exports.getAllUniqueDistricts = getAllUniqueDistricts;
exports.getAllUniqueTaluks = getAllUniqueTaluks;
exports.getAllIssues = getAllIssues;