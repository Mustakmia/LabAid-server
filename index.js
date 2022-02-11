const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require(mongodb).objectId;
const cors = require('cors');
require('dotenv').config();

const app = express(),
    port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot4ar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("LabaidHospital");
        const doctorsCollection = database.collection("addDoctors");


        // get single doctor


        app.get('/addDoctors/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const doctor = await doctorsCollection.findOne(query);
            res.json(doctor);

        })

        // get api

        app.get('/addDoctors', async (req, res) => {
            const cursor = doctorsCollection.find({});
            const addDoctors = await cursor.toArray();
            res.send(addDoctors);
        })

        // POST API
        app.post('/addDoctors', async (req, res) => {

            const doctor = req.body

            console.log('hit the data', doctor);

            const result = await doctorsCollection.insertOne(doctor);

            console.log(result);
            res.json(result)
        });

        //    Delete Api

        app.delete('/addDoctor/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await doctorsCollection.deleteOne(query);
            res.json(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running hospital')
});

app.listen(port, () => {
    console.log('Running hospital in server', port);
    // res.send('post hitted');
});