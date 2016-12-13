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

db.on('error', console.error);
db.once('open', () => {
  console.log('connect');
});

if (process.env.NODE_ENV === 'production') {
  mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT);
} else {
  mongoose.connect('mongodb://localhost/news');
}

const session = require('express-session');

app.use(session({
  secret: '730d3b310ddc23451590f7d44f5b19448b3adef9dd373d42acc7f58f389847b7b17603c4b5d06ac839308e662926586d1a0427949224efbdd0ccb638c49ecb6b',
  cookie: { maxAge: 60 * 1000 },
  httpOnly: false
}));

app.use(cookieParser());
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors);
app.use(filterParams);

app.use(express.static('public'));

app.post('/api/user', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  Member.findOne({name: username, password: password}, (err, result) => {
    if (err) {
      return res.status(400).send({
        status: false
      });
    }
    if (result) {
      req.session.isLogged = true;
      return res.send({
        status: true
      });
    } else {
      return res.status(400).send({
        status: false
      });
    }
  });
});

app.post('/api/user/logout', (req, res) => {
  req.session.isLogged = false;
  return res.send({
    status: true
  });
});

app.post('/api/upload', function(req, res) {
  uploader.post(req, res, function (error, obj, redirect) {
      if(!error) {
        obj.status = true;
        res.send(JSON.stringify(obj));
      }
  });
});

app.use((req, res, next) => {
    if (req.url.startsWith('/api/user') || req.url.startsWith('/api/upload')) {
      return next();
    }
    if (req.session.isLogged) {
        return next();
    } else {
        return res.status(403).send({
            status: false
        });
    }
});

const factories = require('./controllers/factories');

// Member
const members = require('./controllers/members');
app.get('/api/member', members.index);
app.get('/api/member/:id', members.detail);
app.post('/api/member', members.create);
app.put('/api/member/:id', members.update);
app.post('/api/member/:id/upward', members.upward);
app.post('/api/member/:id/downward', members.downward);
const Member = mongoose.model('member');
// app.get('/api/member', factories.indexFactory(Member));
// app.get('/api/member/:id', loginRequired(factories.detailFactory(Member)));
// app.post('/api/member', loginRequired(factories.createFactory(Member, (newObj, totalCount) => {
//   newObj.order = totalCount + 1;
// })));
// app.put('/api/member/:id', loginRequired(factories.updateFactory(Member)));

// app.post('/api/member/:id/upward', loginRequired(factories.upwardFactory(Member)));
// app.post('/api/member/:id/downward', loginRequired(factories.downwardFactory(Member)));

// Team
const Team = mongoose.model('team');
app.get('/api/team', factories.indexFactory(Team));
app.post('/api/team', factories.createFactory(Team));
app.put('/api/team/:id', factories.updateFactory(Team));

// Business
const Business = mongoose.model('business');
app.get('/api/business', factories.indexFactory(Business));
app.get('/api/business/:id', factories.detailFactory(Business));
app.post('/api/business', factories.createFactory(Business));

// Service
const Service = mongoose.model('service');
app.get('/api/service', factories.indexFactory(Service));
app.get('/api/service/:id', factories.detailFactory(Service));
app.post('/api/service', factories.createFactory(Service));

// Client
const Client = mongoose.model('client');
app.get('/api/client', factories.indexFactory(Client));
app.get('/api/client/:id', factories.detailFactory(Client));
app.post('/api/client', factories.createFactory(Client, (newObj, totalCount) => {
  newObj.order = totalCount + 1;
}));
app.put('/api/client/:id', factories.updateFactory(Client));

app.post('/api/client/:id/upward', factories.upwardFactory(Client));
app.post('/api/client/:id/downward', factories.downwardFactory(Client));

// News
const News = mongoose.model('news');
app.get('/api/news', factories.indexFactory(News));
app.get('/api/news/:id', factories.detailFactory(News));
app.post('/api/news', factories.createFactory(News));
app.put('/api/news/:id', factories.updateFactory(News));

// NewsType
const NewsType = mongoose.model('newstype');
app.get('/api/newstype', factories.indexFactory(NewsType));
app.post('/api/newstype', factories.createFactory(NewsType));

app.listen(9090, (err) => {
  if (err) {
    console.log(err);
    return null;
  }
  return console.log('9090 port starting');
});
