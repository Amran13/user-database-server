const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USERS_DB}:${process.env.USERS_PASS}@cluster0.0sxdnca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
     const myUsersCollection = client.db("myUsersDB").collection('myUsers');

    app.get('/users', async(req, res) => {
        const cursor = myUsersCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/users/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await myUsersCollection.findOne(query)
        res.send(result)
    })

    app.post('/users', async(req, res) => {
        const newUser = req.body;
        const result = await myUsersCollection.insertOne(newUser);
        res.send(result)
    })

    app.put('/users/update/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const options = { upsert: true };
        const updatedUser = req.body;
        console.log(updatedUser)
        const updateDoc = {
            $set : {
                name : updatedUser.name,
                email : updatedUser.email
            }
        }
        const result = await myUsersCollection.updateOne(filter, updateDoc, options);
        res.send(result)
    })


    app.delete('/users/:id', async(req, res) => {
        const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await myUsersCollection.deleteOne(query);
            res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('User Database Server is running...')
})

app.listen(port, () => {
    console.log(`USER DATABASE : ${port}`)
})