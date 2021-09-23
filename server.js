const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const logger = require("morgan");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

// db.on("error", error => {
//   console.log("Database Error:", error);
// });

// ! Front End Routes
// brings in the page
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

// brings in the page
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

//! Backend Routes
// this route is for the dashboard display
app.get("/api/workouts/range", function (req, res) {
  db.Workout.find({}).then(function (dbWorkouts) {
    res.json(dbWorkouts);
  });
});

