const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User } = require("../db");
const { authMiddleware } = require("../middlewares");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
  });

  const success = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken/ Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    res.status(411).json({
      message: "Email already taken/ Incorrect inputs",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });

  const userId = user._id;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token,
  });
});

router.post("/signin", async (req, res) => {
  const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
  });

  const success = signinBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Incorrect Username or password",
    });
  }

  const user = await User.find({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
  }
  res.status(200).json({
    token,
  });
  return;

  res.status(411).json({
    message: "Error while logging in",
  });
});

router.put("/", async (req, res) => {
  const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
  });

  const success = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Error while updating information!",
    });
  }

  await User.updateOne({ _id: req._id }, req.body);

  res.status(200).json({
    message: "Updates Successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter;

  const users = await User.find({
    $or: [
      {
        firstname: {
          $regex: filter,
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });

  res.status(200).json({
    users: users.map((user) => ({
      firstname: user.username,
      lastname: user.lastname,
      password: user.password,
      _id: user._id,
    })),
  });
});

module.exports = router;
