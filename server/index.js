const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
let app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});