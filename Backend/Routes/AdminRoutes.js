const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkAdminAuth = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, "secret");
    const isAdmin = decodedToken && decodedToken.id === "admin@gmail.com";

    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Admin is logged in, proceed to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

router.get("/", checkAdminAuth, (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});

router.get("/getUser/:id", checkAdminAuth, (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});

router.put("/updateUser/:id", checkAdminAuth, (req, res) => {
  const id = req.params.id;
  User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});

router.delete("/deleteUser/:id", checkAdminAuth, (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});

router.post("/createUser", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(409).json({ message: "User already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Successfully registered" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the provided email and password match the admin credentials
    if (email === "admin@gmail.com" && password === "admin") {
      // Create a JWT token
      const token = jwt.sign({ id: email }, "secret", { expiresIn: "1h" });

      // Send the token as a response
      res.status(200).json({ auth: true, token: token, user: { email: email } });
    } else {
      res.status(401).json({ auth: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ auth: false, message: "Internal server error" });
  }
});

module.exports = router;
