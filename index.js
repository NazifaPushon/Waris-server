const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000 ;
app.get('/', (req, res) => {
  res.send('Hello assignment')
})

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwbvx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try {
        await client.connect()
        const database = client.db('assignment-12')
        const productsCollection = database.collection('products')
        const usersCollection = database.collection('users')
        const orderCollection = database.collection('order')

        app.get('/products' , async(req , res) => {
            const result = await productsCollection.find({}).toArray()
            res.json(result)
        })

        app.get('/products/:id' , async(req , res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await productsCollection.findOne(query)
            res.json(result)
        })

        app.post('/addProducts' , async(req , res) => {
            const product = req.body ;
            const result = await productsCollection.insertOne(product)
            res.json(result)
        })


        app.get('/orders' , async(req , res) => {
            const result= await orderCollection.find({}).toArray();
            res.json(result)
        })


        app.post('/orders' , async(req , res) => {
            const order = req.body
            const result= await orderCollection.insertOne(order)
            res.json(result)
        })

        app.get('/orders/:email' , async(req , res) => {
            const email = req.params.email;
            const query = {email : email}
            const result= await orderCollection.find(query).toArray();
            res.json(result)
        })

        app.put('/updateOrder/:id' , async(req , res) => {
            const id = req.params.id;
            const updatedBooking = req.body;
            const query = {_id:ObjectId(id)};
            const options = { upsert : true}
            const updatedDoc = {
                $set: {  
                  status:updatedBooking.status
                },
            };
            const result =await orderCollection.updateOne(query,updatedDoc,options)
            res.json(result)
        })

        app.delete('/deleteOrder/:id' , async(req , res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

        app.get('/users' , async(req,res) => {
            const result = await usersCollection.find({}).toArray();
            res.json(result)
        })

        app.post('/users' , async(req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.json(result)
            console.log(result)
        })
    
        app.put('/users' , async(req, res) => {
            const user = req.body
            const filter = {email : user.email}
            const options = { upsert: true };
            const updateDoc = {$set:user}
            const result = await usersCollection.updateOne(filter,updateDoc , options)
            res.json(result)
        })

        app.get('/users/:email' , async(req, res) => {
            const email = req.params.email
            const query = {email : email}
            const user = await usersCollection.findOne(query)
            let isAdmin = false
            if(user?.role === 'admin'){
              isAdmin = true
            }
            res.json({admin:isAdmin})
        })

        app.put('/users/admin' , async(req , res) => {
            const user = req.body;
            console.log(user)
            const filter = {email :user.email}
            const updatedDoc = {$set:{role:"admin"}}
            const result = await usersCollection.updateOne(filter , updatedDoc)
            res.json(result)
        })

        console.log('Database is connected')

    }finally{

    }
}
run().catch(err => console.dir(err))
app.listen(port , () => {
    console.log('server is running at port' , port)
})