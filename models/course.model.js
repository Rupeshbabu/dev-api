const mongoose = require("mongoose");

const CousreSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "please enter description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuitions: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add minimum skills"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dev: {
    type: mongoose.Schema.ObjectId,
    ref: "Dev",
    required: true,
  },
});

//Static method to get avg of course tuition
CousreSchema.statics.getAverageCost = async function (devId) {
  const obj = await this.aggregate([
    {
      $match: { dev: devId },
    },
    {
      $group: {
        _id: "$dev",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await this.model('Dev').findByIdAndUpdate(devId, {
        averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    })
  } catch (error) {
    console.error(error);
  }
};

// Call getAvarage Cost after save
CousreSchema.post("save", function () {
    this.costructor.getAverageCost(this.dev);
});

// Call getAvarage Cost before remove
CousreSchema.post("remove", function () {
    this.costructor.getAverageCost(this.dev);
});

module.exports = mongoose.model("Course", CousreSchema);
