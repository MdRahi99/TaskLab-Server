const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yaqgjrz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const taskAddition =client.db('allTask').collection('taskContainer');
    const dailyTaskCollection =client.db('allTask').collection('dailyTask');

    //daily Tasks
    app.post("/dailyTasks", async (req, res) => {
      const postDailyTask = req.body;
      const result = await dailyTaskCollection.insertOne(postDailyTask);
      res.send(result);
    });
    
    //get daily Tasks By Email
    app.get('/dailyTasks/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email}
      const user = await taskAddition.find(query).toArray();
      res.send(user);
    })
    
    //get Completed Tasks By Role
    app.get('/daily/:role',async(req,res)=>{
      const role = req.params.role;
      const query = {role}
      const user = await taskAddition.find(query).toArray();
      res.send(user);
    })

    //get all daily Tasks
    app.get('/dailyTasks',async(req,res)=>{
      const email = req.params.email;
      const query = {email}
      const user = await dailyTaskCollection.find(query).toArray();
      res.send(user);
    })

     //complete task 

    
     app.put('/dailyTasks/:id',async(req,res)=>{
     

      const id = req.params.id;
      const filter = { _id: ObjectId(id)}
      const options = {upsert: true};
      const updatedDoc ={
        $set:{
          role: 'taskCompleted'
        }
      }
      const result = await taskAddition.updateOne(filter,updatedDoc,options);
      res.send(result);

    })

    //delete

    app.delete('/dailyTasks/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {
        _id: ObjectId(id)
      };
      const result = await taskAddition.deleteOne(filter);
      res.send(result);
    })




//post task
    app.post("/addTask", async (req, res) => {
      const postTask = req.body;
      const result = await taskAddition.insertOne(postTask);
      res.send(result);
    });


   //get allTasks By email
    app.get('/allTasks/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email}
      const user = await taskAddition.find(query).toArray();
      res.send(user);
    })

    //get single media Task
    app.get('/update/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await taskAddition.findOne(query);
      res.send(result)
    })


    //update function
    app.put('/update/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const task= req.body;
      const option = {upsert:true};
      const updatedTask = {
        $set: {
          name: task.name,
          email: task.email,
          taskTitle: task.taskTitle,
          img: task.img,
          description: task.description
        }

      }
      const result = await taskAddition.updateOne(filter, updatedTask, option);
      res.send(result);
    })
   

  }
  finally{

  }

}
run().catch(console.log);


app.get("/", (req, res) => {
  res.send("TaskLab server us running");
});

app.listen(port, () => {
  console.log(`TaskLab server is running on ${port}`);
});