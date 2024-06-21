require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8vxmi4o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const categoryCollection = client.db("grabitDB").collection("categories");
    const dealsCollection = client.db("grabitDB").collection("deals");
    const arrivalsCollection = client.db("grabitDB").collection("arrivals");

    // get all categories data
    app.get("/all-categories", async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result);
    });

    // get all deal
    app.get("/deals", async (req, res) => {
      const result = await dealsCollection.find().toArray();
      res.send(result);
    });

    app.get('/arrivals', async (req, res) => {
      const category = req.query.tabs
      console.log(category);
      const query = {category: category}
      if(category !== "Clothes" || "Footwear" || "Accessories"){
        const result = await arrivalsCollection.find(query).toArray();
        res.send(result)
      }else{

        const result = await arrivalsCollection.find().toArray()
        res.send(result)
      }

      
    })
    

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

app.get("/", (req, res) => {
  res.send("grabit is running now");
});

app.listen(port, () => {
  console.log("grabit is running port", port);
});
