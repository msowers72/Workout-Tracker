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

// this route creates a new workout
app.post("/api/workouts", function (req, res) {
  console.log(req.body);
  db.Workout.create(req.body).then(function (dbWorkouts) {
    db.Workout.findOneAndUpdate(
      { _id: dbWorkouts._id },
      { $push: { exercises: req.body } },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log(success);
        }
      }
    );
    res.json(dbWorkouts);
  });
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
