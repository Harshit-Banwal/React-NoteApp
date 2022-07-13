const connectToMongo = require('./db');
const express = require('express')
const cors = require("cors")
const app = express()
const port = 5000
connectToMongo()

app.use(cors())
app.use(express.json());

app.use('/api/auth', require('./routers/auth'));
app.use('/api/notes', require('./routers/notes'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})