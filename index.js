const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('./middlewares/cors');
const filterParams = require('./middlewares/filterParams');
var options = {
    tmpDir:  join(__dirname, '/public/uploads/tmp'),
    uploadDir: join(__dirname, '/public/uploads/'),
    uploadUrl:  '/uploads/',
    maxPostSize: 11000000000, // 11 GB
    minFileSize:  1,
    maxFileSize:  10000000000, // 10 GB
    acceptFileTypes:  /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes:  /\.(gif|jpe?g|png)/i,
    imageTypes:  /\.(gif|jpe?g|png)/i,
    copyImgAsThumb : true, // required
    imageVersions :{
        maxWidth : 200,
        maxHeight : 200
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    storage : {
        type : 'local',
    },
};
const uploader = require('blueimp-file-upload-expressjs')(options);

const db = mongoose.connection;
const models = join(__dirname, './models');
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

const news = require('./controllers/news');
const teams = require('./controllers/teams');
const members = require('./controllers/members');
const clients = require('./controllers/clients');
db.on('error', console.error);
db.once('open', () => {
  console.log('connect');
});

if (process.env.NODE_ENV === 'production') {
  mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT);
} else {
  mongoose.connect('mongodb://localhost/news');
}

app.use(cookieParser());
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors);
app.use(filterParams);

app.use(express.static('public'));

app.post('/api/user', (req, res) => {
  res.send({
    status: true,
  });
});

app.post('/api/user/logout', (req, res) => {

});

app.post('/api/upload', function(req, res) {
  uploader.post(req, res, function (error, obj, redirect) {
      if(!error) {
        obj.status = true;
        res.send(JSON.stringify(obj));
      }
  });
});

const factories = require('./controllers/factories');
const loginRequired = require('./controllers/decorators').loginRequired;

// Member
const Member = mongoose.model('member');
app.get('/api/member', loginRequired(factories.indexFactory(Member)));
app.get('/api/member/:id', loginRequired(factories.detailFactory(Member)));
app.post('/api/member', loginRequired(factories.createFactory(Member, (newObj, totalCount) => {
  newObj.order = totalCount + 1;
})));
app.put('/api/member/:id', loginRequired(factories.updateFactory(Member)));

app.post('/api/member/:id/upward', loginRequired(factories.upwardFactory(Member)));
app.post('/api/member/:id/downward', loginRequired(factories.downwardFactory(Member)));

// Team
const Team = mongoose.model('team');
app.get('/api/team', loginRequired(factories.indexFactory(Team)));
app.post('/api/team', loginRequired(factories.createFactory(Team)));
app.put('/api/team/:id', loginRequired(factories.updateFactory(Team)));

// Business
const Business = mongoose.model('business');
app.get('/api/business', loginRequired(factories.indexFactory(Business)));
app.get('/api/business/:id', loginRequired(factories.detailFactory(Business)));
app.post('/api/business', loginRequired(factories.createFactory(Business)));

// Service
const Service = mongoose.model('service');
app.get('/api/service', loginRequired(factories.indexFactory(Service)));
app.get('/api/service/:id', loginRequired(factories.detailFactory(Service)));
app.post('/api/service', loginRequired(factories.createFactory(Service)));

// Client
const Client = mongoose.model('client');
app.get('/api/client', loginRequired(factories.indexFactory(Client)));
app.get('/api/client/:id', loginRequired(factories.detailFactory(Client)));
app.post('/api/client', loginRequired(factories.createFactory(Client, (newObj, totalCount) => {
  newObj.order = totalCount + 1;
})));
app.put('/api/client/:id', loginRequired(factories.updateFactory(Client)));

app.post('/api/client/:id/upward', loginRequired(factories.upwardFactory(Client)));
app.post('/api/client/:id/downward', loginRequired(factories.downwardFactory(Client)));

// News
const News = mongoose.model('news');
app.get('/api/news', loginRequired(factories.indexFactory(News)));
app.get('/api/news/:id', loginRequired(factories.detailFactory(News)));
app.post('/api/news', loginRequired(factories.createFactory(News)));
app.put('/api/news/:id', loginRequired(factories.updateFactory(News)));

// NewsType
const NewsType = mongoose.model('newstype');
app.get('/api/newstype', loginRequired(factories.indexFactory(NewsType)));
app.post('/api/newstype', loginRequired(factories.createFactory(NewsType)));

app.listen(9090, (err) => {
  if (err) {
    console.log(err);
    return null;
  }
  return console.log('9090 port starting');
});
