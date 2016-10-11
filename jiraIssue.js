/**
 * Created by jobi on 10/8/16.
 */

function renderForm(req, res) {
    res.render('jiraIssue');
}

function createJiraIssue(req, res) {
   /* var issueType = req.param('ap-issue-type');
    var district = req.param('ap-district');
    var taluk = req.param('ap-taluk');
    var taluk = req.param('no-of-acres');*/

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
                    // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                    //jql: "type=Bug AND status=Closed"
                    fields: {
                        "project":
                        {
                            "id": "10000"
                        },
                        "Summary": "Chittoor",

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
            throw "Login failed :(";
        }
    });

    return res.json({
        success : 'success'
    });
}

exports.renderForm = renderForm;
exports.createJiraIssue = createJiraIssue;