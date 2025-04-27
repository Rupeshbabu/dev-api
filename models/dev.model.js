const mongoose = require("mongoose");
const slugify = require("slugify");
const geoCoder = require("../utils/geoCoder");

const DevSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please enter dscription"],
    maxlength: [5000, "Description can not be more than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [10, "Phone Number can not be longer than 10 charaters"],
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, "Please enter valid email address"],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    //Array of strings
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be atleast 1"],
    max: [10, "Rating mut can not be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

//Create dev slug from the name
DevSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocode & create location field
DevSchema.pre("save", async function (next) {
  const loc = await geoCoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formatted,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    zipcode: loc[0].postcode,
    country: loc[0].countryCode,
  };

  //Do not save address in DB
  this.address = undefined;
  next();
});

// Cascade delete courses when a dev is deleted
DevSchema.pre('remove', async function(next){
  await this.model('Course').deleteMany({ dev:this._id });
  next();
});

// Reverese Populate with virtuals
DevSchema.virtual('courses', {
  ref:'Course',
  localField: '_id',
  foreignField:'dev',
  justOne: false
})

module.exports = mongoose.model("Dev", DevSchema);
