const mongoose = require("mongoose");

const WorkoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now,
  },
  exercises: [
    {
      type: { type: String },
      name: { type: String },
      duration: { type: Number },
      weight: { type: Number },
      reps: { type: String },
      sets: { type: String },
    },
  ],
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;
