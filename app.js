var express = require('express'),
    consolidate = require('consolidate'),
    index = require('./index'),
    session = require('express-session'),
    graph = require('./graph'),
    jiraIssue = require('./jiraIssue');


function launchApp() {
    var app = express();
    app.configure(function () {
        app.set('port', 1337);
    });

    var fs = require('fs');
    module.exports = function(path, options, fn){
        var cacheLocation = path + ':html';
        if(typeof module.exports.cache[cacheLocation] === "string"){
            return fn(null, module.exports.cache[cacheLocation]);
        }
        fs.readFile(path, 'utf8', function(err, data){
            if(err) { return fn(err); }
            return fn(null, module.exports.cache[cacheLocation] = data);
        });
    }
    module.exports.cache = {};

    app.engine('html', consolidate.handlebars);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    app.use('/js', express.static(__dirname + '/public/js'));
    app.use('/css', express.static(__dirname + '/public/css'));
    app.use('/img', express.static(__dirname + '/public/img'));
    app.use('/', express.static(__dirname + '/public/'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'sssh!!!',
        proxy: true,
        resave: true,
        saveUninitialized: true,
        cookie: {secure: false, maxAge: 86400000}
    }));

    app.get('/', index.indexPage);

    app.get('/jira', index.getOAuth);
    app.get('/jira/callback', index.getOAuthCallback);
    app.get('/projects', index.projects);
    app.get('/get-json-from-jira', index.getJsonFromJira);

    app.post('/graph/bar', graph.generateBarGraph);
    app.post('/graph/line', graph.generateLineGraph);
    app.post('/chart/pie', graph.generatePieChart);

    app.get('/CreateIssue', jiraIssue.renderForm);
    app.post('/CreateIssue', jiraIssue.createJiraIssue);


    app.post('/filter-issues', index.filterIssues);
    app.post('/save-to-dashboard', index.saveToDashboard);
    app.get('/graph/edit', graph.editGraph);
    app.get('/graph/edit/get-data', graph.getGraphData);
    app.post('/graph/edit/update', graph.updateGraph);

    var port = app.get('port') || 1337;
    app.listen(port);
}

exports.launchApp = launchApp;
