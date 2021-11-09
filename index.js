const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000 ;
app.get('/', (req, res) => {
  res.send('Hello doctors portal!')
})

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwbvx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try {
        client.connect()
        console.log('Database is connected')
    }finally{

    }
}
run().catch(err => console.dir(err))
app.listen(port , () => {
    console.log('server is running at port' , port)
})