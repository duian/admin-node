const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('./middlewares/cors');
const filterParams = require('./middlewares/filterParams');
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, '/public/uploads'));
  },
  filename: function (req, file, cb) {
    const suffix = file.originalname.split('.')[file.originalname.split('.').length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + suffix);
  }
});
const upload = multer({ storage })
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

app.post('/api/upload',upload.any(), function(req, res, next) {
  const { files } = req;
  const file = files[0];
  // file.url
  console.log('req', req.headers.host);
  res.send({ status: true });
})
// app.param('id', members.load);

app.get('/api/member', members.index);
app.post('/api/member', members.create);
app.put('/api/member/:id', members.update);

app.get('/api/team', (req, res) => {
  teams.index(req, res);
});

app.post('/api/team', teams.create);

app.put('/api/team/:id', teams.update);

app.param('id', clients.load);

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
