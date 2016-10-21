/**
 * Created by jobi on 10/8/16.
 */

var session = require('express-session');
var OAuth = require('oauth').OAuth;
var fs = require('fs');
var base_url = "https://swarmact.atlassian.net"; //example https://test.atlassian.net
var consumer = new OAuth(
        base_url+"/plugins/servlet/oauth/request-token",
        base_url+"/plugins/servlet/oauth/access-token",
    "PMPBuildKey",
    fs.readFileSync('jira.pem', 'utf8'), //consumer secret, eg. fs.readFileSync('jira.pem', 'utf8')
    '1.0',
    "http://localhost:1337/jira1/callback",
    "RSA-SHA1"
);

function renderForm(req, res) {
    res.render('jiraIssue');
}

function createJiraIssue(req, res) {
   /* var issueType = req.param('ap-issue-type');
    var district = req.param('ap-district');
    var taluk = req.param('ap-taluk');
    var taluk = req.param('no-of-acres');*/

    var request = require('request');

    var Client = require('node-rest-client').Client;
    var client = new Client();

    var loginArgs = {
        data: {
            "username": "jobikjohn",
            "password": "jkjjkj"
        },
        headers: {
            "Content-Type": "application/json"
        }
    };

    client.post("https://swarmact.atlassian.net/rest/auth/1/session", loginArgs, function(data, response){
        if (response.statusCode == 200) {
            console.log('succesfully logged in, session:', data.session);
            var session = data.session;
            var args = {
                headers: {
                    cookie: session.name + '=' + session.value,
                    "Content-Type": "application/json"
                },
                data: {
                    fields: {
                        project:
                        {
                            "id": "10000"
                        },
                        summary: "Chittoor",

                        "issuetype": {
                            "id": "10002"
                        }
                    }
                }
            };

            client.post("https://swarmact.atlassian.net/rest/api/2/issue", args, function(result, response) {
                console.log('status code:', response.statusCode);
                console.log('status code:', response.statusCode);
                console.log('result:', result);
            });
        }
        else {
            //throw "Login failed :(";
        }
    });
/*

    var jira = require('jira-api');

    var options = {
        config: {
            "username": "jobikjohn",
            "passowrd": "jkjjkj",
            "host": "https://swarmact.atlassian.net/rest/api/2/issue"
        },
        data: {
            fields: {
                project: {
                    id: "10000"
                },
                summary: "A short summary of the issue",
                description: "A more elaborate decription of the issue",
                issuetype: {
                    id: "10002"
                }
            }
        }
    };

    jira.issue.post(options, function(response) {
        console.log(JSON.stringify(response, null, 4));
    });
*/


    return res.json({
        success : 'success'
    });
}



function getOAuth(req, res) {
    var oa = new OAuth(base_url + "/plugins/servlet/oauth/request-token", //request token
            base_url + "/plugins/servlet/oauth/access-token", //access token
        "PMPBuildKey", //consumer key
        fs.readFileSync('jira.pem', 'utf8'), //consumer secret, eg. fs.readFileSync('jira.pem', 'utf8')
        '1.0', //OAuth version
        "http://localhost:1337/jira1/callback", //callback url
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
                res.redirect('/AddIssue');
            }
        });
}

function AddIssue(req, res) {

    function callback(error, data, resp) {
       /* fs.writeFile('jiraissues.json',"", function (err) {
            if (err) return console.log(err);
            fs.writeFile('jiraissues.json',data, function (err) {
                if (err) return console.log(err);
                res.redirect('/');
            })
        })*/
        console.log('error:', error);
        console.log('data:', data);
        console.log('resp:', resp);
    }

    var args = {
        data: {
            fields: {
                project:
                {
                    "id": "10000"
                },
                summary: "test summary",

                "issuetype": {
                    "id": "10002"
                }
            }
        }
    };
    consumer.post(base_url + "/rest/api/2/issue/" , args,
        req.session.oauth_access_token, //authtoken
        req.session.oauth_access_token_secret, //oauth secret
        callback);
}

exports.renderForm = renderForm;
exports.createJiraIssue = createJiraIssue;
exports.getOAuth = getOAuth;
exports.getOAuthCallback = getOAuthCallback;
exports.AddIssue = AddIssue;