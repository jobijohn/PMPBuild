
var express = require('express');
var session = require('express-session');
var OAuth = require('oauth').OAuth;
var fs = require('fs'),
    common = require('./common');

var base_url = "https://swarmact.atlassian.net"; //example https://test.atlassian.net

function indexPage(req, res) {
    var issueJsonFile = 'jiraissues.json';
    common.readJsonFile(issueJsonFile, function (err, issueData) {
        common.getAllUniqueIssueTypes(issueData, function (err, issueTypes) {
            common.getAllUniqueDistricts(issueData, function (err, districts) {
                common.getAllUniqueTaluks(issueData, function (err, taluks) {
                    console.log('issue types -', issueTypes);
                    console.log('districts -', districts);
                    console.log('taluks -', taluks);
                    // console.log('issueTypes - ',issueTypes);
                    res.render('index_new', {data:issueTypes, data1:districts, data2:taluks});
                });
            });
        });
    });

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
                res.redirect('/projects');
            }
        });
}

function projects (req, res) {
    var consumer = new OAuth(
        base_url+"/plugins/servlet/oauth/request-token",
        base_url+"/plugins/servlet/oauth/access-token",
        "PMPBuildKey",
        fs.readFileSync('jira.pem', 'utf8'), //consumer secret, eg. fs.readFileSync('jira.pem', 'utf8')
        '1.0',
        "http://localhost:1337/jira/callback",
        "RSA-SHA1"
    );

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

exports.indexPage = indexPage;
exports.getOAuth = getOAuth;
exports.getOAuthCallback = getOAuthCallback;
exports.projects = projects;