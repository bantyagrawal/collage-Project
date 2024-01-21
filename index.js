const express = require('express');
const app = express();
require('dotenv').config();
require('./connection/connection')();
const bodyParser = require('body-parser');
const cors = require('cors');

const { userRouter } = require('./Router/userRouter');
const { adminRouter } = require('./Router/adminRouter');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(userRouter);
app.use(adminRouter);

app.listen(8080, () => {
  console.log('server devloyed');
});
