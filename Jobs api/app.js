require('dotenv').config();
const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const express = require('express');
const app = express();

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobsRouter)

app.use(notFoundMiddleware)
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