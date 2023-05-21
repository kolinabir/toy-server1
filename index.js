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

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    // await client.connect();

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
const toysCollection = client.db("toystore").collection("toys");
app.get("/toys", async (req, res) => {
  const result = await toysCollection.find().toArray();
  console.log(result);
  res.send(result);
});
app.post("/toys", async (req, res) => {
  const toy = req.body;
  //if (!toy {
  //     return res.status(404).send({message:"body data not found"})
  //   }
  console.log("new toy", toy);
  const result = await toysCollection.insertOne(toy);
  res.send(result);
});

app.get("/toys/:text", async (req, res) => {
  console.log(req.params.text); // Log the filter text received in the request parameters
  //to get data by specific category
  if (
    req.params.text == "Speed" ||
    req.params.text == "Retro" ||
    req.params.text == "Off-Road"
  ) {
    // If the filter is "remote" or "offline", find jobs with matching status
    const result = await toysCollection
      .find({ subcategory: req.params.text }) // Query the jobs collection with the specified status
      .toArray(); // Convert the result to an array
    return res.send(result); // Send the matching jobs as the response
  } else {
    //to get data by specific id
    const query = { _id: new ObjectId(req.params.text) };
    const user = await toysCollection.findOne(query);
    res.send(user);
  }
  // res.send(result)
});

app.get("/toys/seller/:email", async (req, res) => {
  console.log(req.params.email); // Log the email received in the request parameters
  const query = { sellerEmail: req.params.email };
  try {
    const toys = await toysCollection.find(query).toArray();
    res.send(toys);
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    res.status(500).send("Error querying MongoDB");
  }
});

app.put("/toys/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(id, data);
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };

  const updatedUser = {
    $set: {
      quantity: data.quantity,
      price: data.price,
      description: data.description,
    },
  };

  const result = await toysCollection.updateOne(filter, updatedUser, options);
  res.send(result);
});
app.delete("/toys/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await toysCollection.deleteOne(query);
  res.send(result);
});
app.get("/toys/orderAc/:email", async (req, res) => {
  console.log(req.params.email); // Log the email received in the request parameters
  const query = { sellerEmail: req.params.email };
  try {
    const toys = await toysCollection.find(query).sort({ price: 1 }).toArray();
    res.send(toys);
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    res.status(500).send("Error querying MongoDB");
  }
});
app.get("/toys/orderDc/:email", async (req, res) => {
  console.log(req.params.email); // Log the email received in the request parameters
  const query = { sellerEmail: req.params.email };
  try {
    const toys = await toysCollection.find(query).sort({ price: -1 }).toArray();
    res.send(toys);
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    res.status(500).send("Error querying MongoDB");
  }
});

app.get("/", (req, res) => {
  res.send("toy store server is running");
});

app.listen(port, () => {
  console.log(`toy store server running on port : ${port}`);
});
