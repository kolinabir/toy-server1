const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5003;
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());
//
//

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z0ckcxg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toysCollection = client.db("toystore").collection("toys");
    app.get("/toys", async (req, res) => {
      const result = await toysCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/toys/:text", async (req, res) => {
      console.log(req.params.text); // Log the filter text received in the request parameters

      if (req.params.text == "Speed" || req.params.text == "Retro" || req.params.text == "Off-Road") {
        // If the filter is "remote" or "offline", find jobs with matching status
        const result = await toysCollection
          .find({ subcategory: req.params.text }) // Query the jobs collection with the specified status
          .toArray(); // Convert the result to an array
        return res.send(result); // Send the matching jobs as the response
      }

      // If the filter is not "remote" or "offline", return all jobs
      const result = await toysCollection.find({}).toArray(); // Retrieve all jobs from the collection
      res.send(result); // Send all jobs as the response

      // res.send(result)
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toy store server is running");
});

app.listen(port, () => {
  console.log(`toy store server running on port : ${port}`);
});
