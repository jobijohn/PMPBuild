var express = require('express'),
    consolidate = require('consolidate'),
    index = require('./index'),
    session = require('express-session');


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

    app.use(session({
        secret: 'cookie_secret',
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));

    app.get('/', index.indexPage);
    app.get('/jira', index.getOAuth);
    app.get('/jira/callback', index.getOAuthCallback);
    app.get('/projects', index.projects);

    var port = app.get('port') || 1337;
    app.listen(port);
}

exports.launchApp = launchApp;
