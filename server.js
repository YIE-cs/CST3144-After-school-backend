const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
let lessons = require("./lesson.js");
const port = 3000;
app.use((req, res, next) => {
  console.log("Incoming request: " + req.method + " from: " + req.url);
  //   res.end("Hello World!");
  next();
});
app.get("/lessons", (req, res) => {
  res.json(lessons);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
