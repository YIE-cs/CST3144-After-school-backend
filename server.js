const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
app.use(cors());
let lessons = require("./lesson.js");
const port = 3000;
app.use((req, res, next) => {
  console.log("Incoming request: " + req.method + " from: " + req.url);
  //   res.end("Hello World!");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/lessons", (req, res) => {
  res.json(lessons);
});
app.get("/lessons/:id", (req, res) => {
  let lessonId = req.params.id;
  let lesson = lessons.find((lesson) => lesson.id == lessonId);
  if (lesson) {
    res.json(lesson);
  } else {
    res.status(404).send("Lesson not found");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
