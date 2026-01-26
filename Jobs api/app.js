require('dotenv').config();
const connectDB = require('./db/connect');
const express = require('express');
const app = express();

app.use(express.json())

app.use('/api/v1/auth', auth)
app.use('/api/v1/jobs', jobs)

app.use(notFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const url = process.env.MONGO_URI

const start = async ()=> {
  try {
    await connectDB(url)
    app.listen(port, ()=> console.log(`Server is listening on port ${port}...`))
  }
  catch (error) {
    console.log(error)
  }
}

start()