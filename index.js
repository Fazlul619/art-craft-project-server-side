const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000; // or any port of your choice

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crkhnnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const craftCollection = client.db("craftDB").collection("craft");
    app.get("/addCraftItems", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // new data code

    await client.connect();
    const artCraftCollection = client
      .db("craftDB")
      .collection("Art & Craft Categories Section");

    app.get("/artCraftItems", async (req, res) => {
      try {
        const cursor = artCraftCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/addCraftItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });
    app.put("/addCraftItems/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const Craft = {
        $set: {
          imageUrl: updatedCraft.imageUrl,
          itemName: updatedCraft.itemName,
          subcategoryName: updatedCraft.subcategoryName,
          shortDescription: updatedCraft.shortDescription,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customizationData: updatedCraft.customizationData,
          processingTime: updatedCraft.processingTime,
          StockData: updatedCraft.StockData,
        },
      };
      const result = await craftCollection.updateOne(filter, Craft, options);
      res.send(result);
    });

    app.post("/addCraftItems", async (req, res) => {
      const newCraftItem = req.body;
      console.log(newCraftItem);
      const result = await craftCollection.insertOne(newCraftItem);
      res.send(result);
    });

    app.delete("/addCraftItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
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
  res.send("coffee making is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
