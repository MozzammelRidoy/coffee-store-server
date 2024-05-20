const express = require('express'); 
const cors = require('cors'); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express(); 
const port = process.env.PORT || 5000; 

//middleware 
app.use(cors()); 
app.use(express.json()); 


// MongoDB here

// mongodb online
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmeeuxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//mongodb offline
// const uri = 'mongodb://localhost:27017'; 

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

    const coffeesCollectionDB = client.db("coffeesDB").collection("coffees"); 
    const usersCollectionDB = client.db('usersDB').collection('users'); 


    //all coffees get or show form mongoDB
    app.get('/coffees', async(req, res)=> {
        const cursor = coffeesCollectionDB.find(); 
        const result = await cursor.toArray(); 
        res.send(result);
    })


    // single coffee add or insert in mongoDB
    app.post('/coffees', async(req, res)=> {
        const newCoffee = req.body; 
        console.log(newCoffee);

        const result = await coffeesCollectionDB.insertOne(newCoffee); 
        res.send(result);
    })

    // sigle coffe delete or remove from mongoDB
    app.delete('/coffees/:id', async(req, res)=> {
        const id = req.params.id; 
        const query = {_id : new ObjectId(id)}; 
        const result = await coffeesCollectionDB.deleteOne(query); 
        res.send(result);
    })

    // single Coffee Update or Modify in mongodb
    //secific coffee search for update
    app.get('/coffees/:id', async(req, res)=> {
        const id = req.params.id; 
        const query = {_id : new ObjectId(id)}; 
        const result = await coffeesCollectionDB.findOne(query); 
        res.send(result);

    })

    // update coffee 
    app.put('/coffees/:id', async(req, res)=> {
        const id = req.params.id; 
        const coffee = req.body; 
        const filter = {_id : new ObjectId(id)}; 
        const options = {upsert : true}; 
        const updateCoffee = {
            $set : {
                name : coffee.name ,
                chef : coffee.chef , supplier : coffee.supplier , taste : coffee.taste , category : coffee.category , details : coffee.details , photo  : coffee.photo , quantity : coffee.quantity , price : coffee.price
            }
        }
        const result = await coffeesCollectionDB.updateOne(filter, updateCoffee, options); 
        res.send(result); 
    })

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------


    // user information login register data 

    //users data show or get from mongodb
    app.get('/users', async(req, res)=> {
        const cursor = usersCollectionDB.find(); 
        const result = await cursor.toArray(); 
        res.send(result);
        
    })



    // users data insert or post in MondoDB
    app.post('/users', async(req, res)=> {
        const newUser = req.body; 
        const result = await usersCollectionDB.insertOne(newUser); 
        res.send(result); 
    })


    // users information delete from mongoDB
    app.delete('/users/:id', async(req, res)=> {
        const id = req.params.id; 
        const query = {_id : new ObjectId(id)}; 
        const result = await usersCollectionDB.deleteOne(query); 
        res.send(result); 
    })

    // user update last login time 
    app.patch('/users', async(req, res)=> {
        const loginUser = req.body; 
        const filter = {email : loginUser.email}; 
        const updateDoc = {
            $set: {
                lastSignInTime: loginUser.lastSignInTime
            }
        }; 
        const result = await usersCollectionDB.updateOne(filter, updateDoc); 
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



app.get('/', (req, res)=> {
    res.send('Coffee Store Server is Running'); 
})

app.listen(port, ()=> {
    console.log(`Coffee Server is Running on PORT : ${port}`);
})