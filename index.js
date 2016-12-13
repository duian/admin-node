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

app.post('/api/upload', function(req, res) {
  uploader.post(req, res, function (error, obj, redirect) {
      if(!error) {
        obj.status = true;
        res.send(JSON.stringify(obj));
      }
  });

});
// app.param('id', members.load);

app.get('/api/member', members.index);
app.post('/api/member', members.create);
app.put('/api/member/:id', members.update);

app.get('/api/team', teams.index);
app.post('/api/team', teams.create);
app.put('/api/team/:id', teams.update);
// app.param('id', clients.load);

app.get('/api/client', clients.index);
app.post('/api/client', clients.create);
app.put('/api/client/:id', clients.update);


app.param('id', news.load);

app.get('/api/news', news.index);
app.post('/api/news', news.create);
app.put('/api/news/:id', news.update);


/*
app.get('/api/client', (req, res) => {
  console.log('res', req.headers);
  clients.index(req, res);
});

app.post('/api/client', clients.create);

app.put('/api/client/:id', clients.update);
*/
//app.delete('/api/client/:id', clients.destroy);

app.listen(9090, (err) => {
  if (err) {
    console.log(err);
    return null;
  }

  return console.log('9090 port starting');
});
