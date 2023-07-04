const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

//Middlewares
app.use(cors());
app.use(express.json());

//DB connection
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log('DB connect Successfully');
  })
  .catch((err) => {
    console.log(err);
  });

//Routes
app.use('/api/auth', require('./routers/auth'));
app.use('/api/notes', require('./routers/notes'));
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//Server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
