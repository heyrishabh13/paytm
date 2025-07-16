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

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  balance: {
    type: Number,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
  User,
  Account,
};
