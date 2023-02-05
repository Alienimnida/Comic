const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID;
const port = 3000;

//middleware
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lo2xlaw.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("CRUD");
        const comicCollection = database.collection("comics");
        //post data
        app.post('/comics', async (req, res) => {
            const comic = req.body
            const result = await comicCollection.insertOne(comic);
            res.json(result)
        })

        //get all comics
        app.get('/comics', async (req, res) => {
            const query = {};
            const cursor = comicCollection.find(query);
            const result = await cursor.toArray();
            res.json(result)
        })
        //get a single comic 
        app.get('/comics/:id', async (req, res) => {
            const comicId = req.params.id;
            const query = { _id: ObjectID(comicId) };
            const result = await comicCollection.findOne(query);
            res.json(result)
        })
        //update comic 
        app.put('/comics/:id', async (req, res) => {
            const comicId = req.params.id;
            const comic = req.body;
            const filter = { _id: ObjectID(comicId) };
            const updateComic = {
                $set: {
                    title: comic.title,
                    body: comic.body
                },
            };
            const result = await comicCollection.updateOne(filter, updateComic);
            res.json(result)
        })
        app.delete('/comics/:id', async(req,res)=>{
            const comicId = req.params.id;
            const query = { _id: ObjectID(comicId) };
            const result = await comicCollection.deleteOne(query);
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
