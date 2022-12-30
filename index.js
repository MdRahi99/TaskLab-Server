const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yaqgjrz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const taskAddition = client.db("allTask").collection("taskContainer");

    //post task
    app.post("/addTask", async (req, res) => {
      const postTask = req.body;
      const result = await taskAddition.insertOne(postTask);
      res.send(result);
    });

    //get allTasks By email
    app.get("/allTasks/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await taskAddition.find(query).toArray();
      res.send(user);
    });

    //get Completed Tasks By Role
    app.get("/completedTasks/:role", async (req, res) => {
      const role = req.params.role;
      const query = { role };
      const user = await taskAddition.find(query).toArray();
      res.send(user);
    });

    //complete task
    app.put("/completedTasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "taskCompleted",
        },
      };
      const result = await taskAddition.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    //delete
    app.delete("/completedTasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: ObjectId(id),
      };
      const result = await taskAddition.deleteOne(filter);
      res.send(result);
    });
    
  } finally {
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("TaskLab server us running");
});

app.listen(port, () => {
  console.log(`TaskLab server is running on ${port}`);
});
