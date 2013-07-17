//                          __       
//    ____ ___  ___  ____  / /_______
//   / __ `__ \/ _ \/ __ \/ //_/ ___/
//  / / / / / /  __/ / / / ,< / /    
// /_/ /_/ /_/\___/_/ /_/_/|_/_/     
//
// @pkg: menkr app suite for wechat
// @name: Wechat Wall
// @npm: npm install wachat-wall

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var config = require('./config');

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('wechat wall'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get(config.url, require('./routes/auth'));
app.post(config.url, require('./routes/index'));

// run 
http.createServer(app).listen(app.get('port'));