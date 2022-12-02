const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


//Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhuxjuh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        await client.connect();
        const projectsCollection = client.db('portfolio').collection('projects');
        const messageCollection = client.db('portfolio').collection('message');
        //Project creation and update
        app.post('/project',async (req,res)=>{
            const project=req.body;
            const result = await projectsCollection.insertOne(project);
            res.send(result)
        });
            
        //Get the created project
        app.get('/project', async(req,res)=>{
            const result = await projectsCollection.find().toArray();
            res.send(result)
        });

           //Get only one project details
           app.get('/project/:id', async(req,res)=>{
            const projectId= req.params.id;
            const query = {_id: ObjectId(projectId)}
            const result= await projectsCollection.findOne(query);
            res.send(result)
        });

        //New send message
        app.post('/message',async (req,res)=>{
            const message=req.body;
            console.log(message)
            const result = await messageCollection.insertOne(message);
            res.send(result)
        });

        //Get all the send message
        app.get('/message', async(req,res)=>{
            const result = await messageCollection.find().toArray();
            res.send(result)
        });
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Personal Portfolio')
  })

  app.listen(port, () => {
    console.log(`The live running  ${port}`)
  })