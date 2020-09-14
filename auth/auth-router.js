const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "Shhh. This is a secret";

const authModel = require("./auth-model");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  // implement registration
  try {
    const { username, password } = req.body;
    const user = await authModel.findBy({ username }).first();
    console.log(user);

    if (user) {
      return res.status(409).json({ message: "Please pick a unique username" });
    }

    const newUser = await authModel.add({
      username,
      password: await bcryptjs.hash(password, 14),
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  // implement login
  try {
    const { username, password } = req.body;
    const user = await authModel.findBy({ username }).first();

    if (!user) {
      return res.status(401).json({ message: "Username or password invalid" });
    }

    const passwordValid = await bcryptjs.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: "Username or password invalid" });
    }

    const token = jwt.sign({ user }, JWT_SECRET);
    res.cookie("token", token);

    res.json({
      message: `Welcome ${user.username}!`,
      token: token,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
