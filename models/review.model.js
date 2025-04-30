const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 120,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 to 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  dev: {
    type: mongoose.Schema.ObjectId,
    ref: "Dev",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent user from submitting more than one review per dev
ReviewSchema.index({ dev: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (devId) {
  const obj = await this.aggregate([
    {
      $match: { dev: devId },
    },
    {
      $group: {
        _id: "$dev",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("dev").findByIdAndUpdate(devId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error(error);
  }
};

ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.dev);
});

ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.dev);
});

module.exports = mongoose.model("Review", ReviewSchema);
