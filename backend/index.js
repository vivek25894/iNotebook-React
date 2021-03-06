const connectToMongo = require('./db');

connectToMongo();

const express = require('express')
const app = express()
const port = 5000

const cors = require('cors')
app.use(cors())

app.use(express.json()); 
// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


// app.get('/', (req, res) => 
//   res.send('Hello Vivek!')
// )

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})
