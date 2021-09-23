const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const logger = require("morgan");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

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
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: { $sum: "$exercises.duration" },
      },
    },
  ]).then(function (dbWorkouts) {
    console.log(dbWorkouts);
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

// this allows you to get a workout by id
app.put("/api/workouts/:id", function (req, res) {
  let id = req.params.id;
  db.Workout.findOneAndUpdate(
    { _id: id },
    { $push: { exercises: req.body } },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        res.send(success);
      }
    }
  );
});

// this route will get all the workouts from the data base
app.get("/api/workouts", function (req, res) {
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: { $sum: "$exercises.duration" },
      },
    },
  ])
    .then((dbWorkouts) => {
      res.json(dbWorkouts);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
