const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://heyrishabh13:fdyzvM0QOh5LmRms@cluster0.rjwuyra.mongodb.net/paytm"
);

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    require: true,
    minLength: 6,
  },
  firstname: {
    type: String,
    require: true,
    trim: true,
    maxLength: 50,
  },
  lastname: {
    type: String,
    require: true,
    trim: true,
    maxLength: 50,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
