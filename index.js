
var express = require('express');
var session = require('express-session');
var OAuth = require('oauth').OAuth;
var fs = require('fs'),
    common = require('./common'),
    graph = require('./graph'),
    async = require('async');

var base_url = "https://swarmact.atlassian.net"; //example https://test.atlassian.net
var consumer = new OAuth(
        base_url+"/plugins/servlet/oauth/request-token",
        base_url+"/plugins/servlet/oauth/access-token",
    "PMPBuildKey",
    fs.readFileSync('jira.pem', 'utf8'), //consumer secret, eg. fs.readFileSync('jira.pem', 'utf8')
    '1.0',
    "http://localhost:1337/jira/callback",
    "RSA-SHA1"
);

function indexPage(req, res) {
    var issueJsonFile = 'jiraissues.json';
    var indexData = {};
    common.readJsonFile(issueJsonFile, function (err, issueData) {
        common.getAllUniqueIssueTypes(issueData, function (err, issueTypes) {
            indexData.issueTypes = issueTypes;
            common.getAllUniqueDistricts(issueData, function (err, districts) {
                indexData.districts = districts;
                common.getAllUniqueTaluks(issueData, function (err, taluks) {
                    indexData.taluks = taluks;
                    common.getAllIssues(issueData, function (err, allIssues) {
                        indexData.allIssues = allIssues;
                        getSavedGraphAndIssuesFilter(function(err, savedFilters) {
                            getDataForSavedGraphAndIssuesFilter(savedFilters, function (err, savedFilterData) {
                                indexData.savedFilterData = savedFilterData;
                                res.render('dashboard', {indexData:indexData});
                            });
                        });
                    });
                });
            });
        });

    });
    //res.render('dashboard', {data:issueTypes, data1:districts, data2:taluks});

}

function getOAuth(req, res) {
    var oa = new OAuth(base_url + "/plugins/servlet/oauth/request-token", //request token
        base_url + "/plugins/servlet/oauth/access-token", //access token
        "PMPBuildKey", //consumer key
        fs.readFileSync('jira.pem', 'utf8'), //consumer secret, eg. fs.readFileSync('jira.pem', 'utf8')
        '1.0', //OAuth version
        "http://localhost:1337/jira/callback", //callback url
        "RSA-SHA1");
    oa.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret) {
        if (error) {
            console.log(error.data);
            res.send('Error getting OAuth access token');
        } else {
            req.session.oa = oa;
            req.session.oauth_token = oauthToken;
            req.session.oauth_token_secret = oauthTokenSecret;
            return res.redirect(base_url + "/plugins/servlet/oauth/authorize?oauth_token=" + oauthToken);
        }
    });
}

function getOAuthCallback (req, res) {
    var oa = new OAuth(req.session.oa._requestUrl,
        req.session.oa._accessUrl,
        req.session.oa._consumerKey,
        fs.readFileSync('jira.pem', 'utf8'), //consumer secret, eg. fs.readFileSync('jira.pem', 'utf8')
        req.session.oa._version,
        req.session.oa._authorize_callback,
        req.session.oa._signatureMethod);

    oa.getOAuthAccessToken(
        req.session.oauth_token,
        req.session.oauth_token_secret,
        req.param('oauth_verifier'),
        function (error, oauth_access_token, oauth_access_token_secret, results2) {
            if (error) {
                console.log('error');
            } else {
                // store the access token in the session
                req.session.oauth_access_token = oauth_access_token;
                req.session.oauth_access_token_secret = oauth_access_token_secret;

                // res.send({
                //     message: "successfully authenticated.",
                //     access_token: oauth_access_token,
                //     secret: oauth_access_token_secret
                // });
                res.redirect('/get-json-from-jira');
            }
        });
}

function getJsonFromJira(req, res) {
    /*var consumer = new OAuth(
        base_url+"/plugins/servlet/oauth/request-token",
        base_url+"/plugins/servlet/oauth/access-token",
        "PMPBuildKey",
        fs.readFileSync('jira.pem', 'utf8'), //consumer secret, eg. fs.readFileSync('jira.pem', 'utf8')
        '1.0',
        "http://localhost:1337/jira/callback",
        "RSA-SHA1"
    );*/

    function callback(error, data, resp) {
        fs.writeFile('jiraissues.json',data, function (err) {
            if (err) return console.log(err);
            res.redirect('/');
        })
    }
    consumer.get(base_url+"/rest/api/2/search?jql=project%20%3D%20MGM",
        req.session.oauth_access_token, //authtoken
        req.session.oauth_access_token_secret, //oauth secret
        callback);
}

function filterIssues (req, res){
    var district = req.param('district');
    var taluk = req.param('taluk');
    var issuetype = req.param('issuetype');
    var acres = req.param('acres');
    //-------------------------------
    var districtFilter = "(e.fields.customfield_10400 != null)&&(";
    for(i=0;i<district.length;i++) {
        if (i != district.length - 1) {
            districtFilter += 'e.fields.customfield_10400.value == "'+ district[i] + '"||';
        } else {
            districtFilter += 'e.fields.customfield_10400.value == "'+ district[i] + '")';
        }
    }
    //--------------------------------
    console.log('district filter', districtFilter);
    //--------------------------------
    var talukFilter = "(e.fields.customfield_10401 != null &&  (";
    for(i=0;i<taluk.length;i++) {
        if (i != taluk.length - 1) {
            talukFilter += 'e.fields.customfield_10401.value == "'+ taluk[i] + '"||';
        } else {
            talukFilter += 'e.fields.customfield_10401.value == "'+ taluk[i] + '"))';
        }
    }

    //--------------------------------
    console.log('taluk filter', talukFilter);
    //--------------------------------
    var issuetypeFilter = "e.fields.issuetype.name == '"+ issuetype +"'";
    //--------------------------------
    console.log('issuetypeFilter', issuetypeFilter);
    //--------------------------------
    var acreFilter = "(e.fields.customfield_10403 != null)&&(";
    for(i=0;i<acres.length;i++) {
        if (i != acres.length - 1) {
            acreFilter += 'e.fields.customfield_10403'+ acres[i] + '&&';
        } else {
            acreFilter += 'e.fields.customfield_10403'+ acres[i] + ')';
        }
    }
    //--------------------------------
    console.log('acre filter', acreFilter);
    var issueJsonFile = 'jiraissues.json';
    common.readJsonFile(issueJsonFile, function (err, issueData) {
        var issues = issueData.issues;
        var filteredIssues = issues.filter(function (e) {
            return eval(issuetypeFilter) &&
                eval(districtFilter) &&
                eval(talukFilter) &&
                eval(acreFilter);
        });
        fs.writeFile('filteredissues.json', JSON.stringify(filteredIssues), function (err) {
            if (err) return console.log(err);
            return res.json({
                success : 'success',
                filteredIssues:filteredIssues
            });
        });
    });
}

/**
 * Get Selected Issues by filter
 * @param savedFilters
 * @param callback
 */
function getIssuesByFilters(savedFilters, callback) {
    var district = savedFilters.districts.split(',');
    var taluk = savedFilters.taluks.split(',');
    var issuetype = savedFilters.issuetype;
    var acres = savedFilters.acres.split(',');

    var districtFilter = "(e.fields.customfield_10400 != null)&&(";
    for(i=0;i<district.length;i++) {
        if (i != district.length - 1) {
            districtFilter += 'e.fields.customfield_10400.value == "'+ district[i] + '"||';
        } else {
            districtFilter += 'e.fields.customfield_10400.value == "'+ district[i] + '")';
        }
    }

    var talukFilter = "(e.fields.customfield_10401 != null &&  (";
    for(i=0;i<taluk.length;i++) {
        if (i != taluk.length - 1) {
            talukFilter += 'e.fields.customfield_10401.value == "'+ taluk[i] + '"||';
        } else {
            talukFilter += 'e.fields.customfield_10401.value == "'+ taluk[i] + '"))';
        }
    }

    var issuetypeFilter = "e.fields.issuetype.name == '"+ issuetype +"'";

    var acreFilter = "(e.fields.customfield_10403 != null)&&(";
    for(i=0;i<acres.length;i++) {
        if (i != acres.length - 1) {
            acreFilter += 'e.fields.customfield_10403'+ acres[i] + '&&';
        } else {
            acreFilter += 'e.fields.customfield_10403'+ acres[i] + ')';
        }
    }

    var issueJsonFile = 'jiraissues.json';
    common.readJsonFile(issueJsonFile, function (err, issueData) {
        var issues = issueData.issues;
        var filteredIssues = issues.filter(function (e) {
            return eval(issuetypeFilter) &&
                eval(districtFilter) &&
                eval(talukFilter) &&
                eval(acreFilter);
        });
        fs.writeFile('filteredissues.json', JSON.stringify(filteredIssues), function (err) {
            if (err) return console.log(err);
            var issueSummary = [];
            for (var data in filteredIssues) {
                var summary = filteredIssues[data].fields.summary;
                issueSummary.push({summary:summary});
            }
            callback(null, issueSummary);
        });
    });
}

/**
 * Function to save filters and graph filters into a file
 * @param req
 * @param res
 */
function saveToDashboard(req, res) {
    var filters = req.param('filtersNew');
    var saveData;
    fs.readFile('savedfilters.txt', 'utf8', function (err, txtData) {
        if (err) {
            callback(err, null);
        }
        if(txtData) {
            saveData = txtData + '|' + filters;
        } else {
            saveData = filters;
        }
        fs.writeFile('savedfilters.txt', saveData, function (err) {
            if(err) return console.log(err);
            return res.json({
                success:'success'
            });
        });

    });
}

/**
 * Function to get saved filters
 * @param callback
 */
function getSavedFilters(callback) {
    fs.readFile('savedfilters.txt', 'utf8', function (err, txtData) {
        if (err) {
            callback(err, null);
        }
        callback(null, txtData);
    });
}

/**
 * Functo get All saved graph and filters
 * @param callback
 */
function getSavedGraphAndIssuesFilter(callback) {
    getSavedFilters(function (err, txtData) {
        var savedfilters = txtData.split("|");
        var eachfilter = [], eachFilterSplit = [];

        for(var i in savedfilters) {
            var filterValues = savedfilters[i].split("&&");
            eachfilter.push(filterValues);
        }

        for(var j in eachfilter) {
            var dummyArray = [];
            for(var k in eachfilter[j]) {
                var splitEachfilter = eachfilter[j][k].split("=");
                dummyArray[splitEachfilter[0]] = splitEachfilter[1];
            }
            eachFilterSplit.push(dummyArray);
        }
        callback(null, eachFilterSplit);
    }) ;
}

function getDataForSavedGraphAndIssuesFilter(savedFilters, callback) {
    var savedFiltersData = [];
    async.each(savedFilters, function(filter, callback) {
        var dummy = {};
        getIssuesByFilters(filter, function (err, selectedIssues) {
            graph.populateGraphData(filter, function (err, graphData) {
                dummy.selectedIssues = selectedIssues;
                dummy.graphData = graphData;//console.log('dummy', dummy);
                savedFiltersData.push(dummy);
                callback();
            });
        });
    }, function(err){
            console.log('All files have been processed successfully',savedFiltersData);
        callback(null, savedFiltersData);
    });
}

exports.indexPage = indexPage;
exports.getOAuth = getOAuth;
exports.getOAuthCallback = getOAuthCallback;
exports.getJsonFromJira = getJsonFromJira;
exports.filterIssues = filterIssues;
exports.saveToDashboard = saveToDashboard;