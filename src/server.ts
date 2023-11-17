import express from 'express'
import bodyParser from 'body-parser'
import { logRequest } from './middlewares/request-logs'
import personRouter from './routes/person'
import logsRouter from './routes/logs'

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(logRequest)

app.use('/api/person', personRouter)

app.use('/api/logs', logsRouter)

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})
