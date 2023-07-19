const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const verifyToken = require("../auth");
const multer = require("multer"); // Import multer package

router.use(cookieParser());


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Save the uploaded files in the "uploads" directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set a unique filename for each uploaded file
  },
});

const upload = multer({ storage: storage });

router.get("/validateToken", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "secret");
    const userId = decodedToken.id;

    // Perform any additional validation or user lookup if required

    res.status(200).json({ auth: true, user: { id: userId } });
  } catch (error) {
    console.log(error);
    res.status(401).json({ auth: false });
  }
});

router.post("/login", async (req, res) => {
  console.log("Login request received");

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password); // Await the password comparison

      if (passwordMatch) {
        // Create a JWT token
        const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });

        // Fetch the profile picture filename from the user data
        const profilePicture = user.profilePicture;

        res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
        res.status(200).json({ auth: true, token: token, user: user, profilePicture: profilePicture }); // Send the profile picture filename
      } else {
        res.status(401).json({ auth: false, message: "Invalid password" });
      }
    } else {
      res.status(404).json({ auth: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ auth: false, message: "Internal server error" });
  }
});


router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(409).json({ message: "User already registered" });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profilePicture: req.file ? req.file.filename : null, // Save the filename in the database
      });
      await newUser.save();
      res.status(201).json({ message: "Successfully registered" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected route example
router.get("/protected", verifyToken, (req, res) => {
  // The token is valid, perform protected actions here
  res.json({ message: "Protected route accessed" });
});

module.exports = router;
