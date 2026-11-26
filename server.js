const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require("morgan");

const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const path = require("path");
app.use(cors());

const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request: " + req.method + " from: " + req.url);
  //   res.end("Hello World!");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

let db1;
const uri =
  process.env.MONGODB_PREFIX +
  process.env.MONGODB_USERNAME +
  ":" +
  process.env.MONGODB_PASSWORD +
  process.env.MONGODB_URL;

const client = new MongoClient(uri);
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");

    db1 = client.db("afterSchoolLessons");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();

app.get("/lessons", async (req, res) => {
  try {
    let lessons = await db1.collection("lesson").find({}).toArray();
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching lessons");
  }
});

app.get("/lessons/:id", async (req, res) => {
  try {
    const lessonId = Number(req.params.id);

    const lesson = await db1.collection("lesson").findOne({
      id: lessonId,
    });

    if (lesson) {
      res.json(lesson);
    } else {
      res.status(404).send("Lesson not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching lesson");
  }
});

app.post("/order", async (req, res) => {
  try {
    const newOrder = req.body;

    const result = await db1.collection("order").insertOne(newOrder);

    res.status(201).json({
      message: "Order submitted successfully",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
});

app.put("/lessons/:id", async (req, res) => {
  try {
    const lessonId = Number(req.params.id);
    const updatedLesson = req.body;

    const result = await db1
      .collection("lesson")
      .updateOne({ id: lessonId }, { $set: updatedLesson });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      message: "Lesson updated successfully",
    });
  } catch (error) {
    console.error("Error updating lesson:", error);

    res.status(500).json({
      message: "Failed to update lesson",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
