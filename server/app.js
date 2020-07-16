const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const iot = require('./mqtt/mqtt');
// const io = null;

// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// const cors = require('cors');
// app.use(cors);

const lifecycle = require('./lifecycle/lifecycle');

const HttpError = require('./models/http-error');

const jobRoutes = require('./routes/job-routes');
const mhmRoutes = require('./routes/mhm-routes');
const soRoutes = require('./routes/so-routes');
const mapRoutes = require('./routes/map-routes');
const lifecycleRoutes = require('./routes/lifecycle-routes');
const loginRoutes = require('./routes/login-routes.js');

app.use(bodyParser.json()); // Parses all incoming data for POST requests.
app.use(bodyParser.urlencoded({ extended: true }));

// Setting headers to allow browser to access backend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});


app.use('/api/mhm', mhmRoutes);
app.use('/api/so', soRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/map', mapRoutes)
app.use('/api/lifecycle', lifecycleRoutes);
app.use('/api/login', loginRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404);
});

const connectURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-jz0r0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectConfig = { 
   useNewUrlParser: true, 
   useUnifiedTopology: true, 
   useCreateIndex: true 
   }

mongoose
   .connect(connectURL)
   .then(() => {
      console.log('Connected to database!');
      app.listen(5000);
      lifecycle.initLifecycle();
   })
   .catch(err => {
      console.log('SOMETHING HAPPENED!',err)
   });

   //create tag 15 and 9