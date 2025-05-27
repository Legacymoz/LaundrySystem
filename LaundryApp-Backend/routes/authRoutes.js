const express = require("express");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect, adminOnly } = require("../controllers/authMiddleware");
const Order = require("../models/Orders");
const Notification = require("../models/Notifications");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Configure multer for file uploads

const router = express.Router();

router.get("/users", (req, res) => {
    User.find()
        // .select("-password")
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ message: "Error fetching users", error }));
})

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password, roles, name, number, email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or Username already exists" });

    const newUser = new User({
      username,
      password,
      roles,
      name,
      number,
      email,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {

    console.log("Login attempt:", req.body); // Log the login attempt
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log("Generated token:", token); // Log the generated token


    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles,
        name: user.name,
        email: user.email,
        number: user.number,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
    console.log(error)
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// GET CURRENT USER (Protected Route)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// ADMIN ROUTE -- Dont use this
router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// CLIENT DASHBOARD DATA
router.get("/client-dashboard", protect, async (req, res) => {
  try {
    if (!req.user.roles.includes("user")) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch client-specific data (e.g., orders, notifications)
    const orders = await Order.find({ customerID: req.user.id });
    const notifications = await Notification.find({ customerID: req.user.id });

    res.json({ orders, notifications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching client data", error });
  }
});

// ADMIN DASHBOARD DATA
router.get("/admin-dashboard", protect, adminOnly, async (req, res) => {
  try {
    // Fetch admin-specific data (e.g., all orders, all users)
    const orders = await Order.find();
    const users = await User.find().select("-password");

    res.json({ orders, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin data", error });
  }
});

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
}); 


// // Update Profile
// router.patch("/profile", protect, upload.single("profilePic"), async (req, res) => {
//   try {
//     const { name, email, number, address, password } = req.body;
//     const updates = {};

//     if (name) updates.name = name;
//     if (email) updates.email = email;
//     if (number) updates.number = number;
//     if (address) updates.address = address;

//     // Handle password update
//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updates.password = hashedPassword;
//     }

//     // Handle profile picture update
//     if (req.file) {
//       updates.profilePic = req.file.path; // Save the file path
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
//       new: true,
//     });

//     res.json({ message: "Profile updated successfully", user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating profile", error });
//   }
// });

router.patch("/profile", protect, async (req, res) => {
  try {
    const { name, email, number } = req.body;
    const updates = {};

    console.log("Profile update request:", req.body); // Log the request body

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (number) updates.number = number;

    console.log(updates);

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});

module.exports = router;
