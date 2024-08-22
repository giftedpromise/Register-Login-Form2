const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const session = require("express-session");
const UserModel = require("./model/User");

dotenv.config();
const app = express();
app.use(express.json());

// CORS options
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsInsecure: true, // Temporarily disable strict certificate validation
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.user = {
          id: user._id,
          name: user.name,
          email: user.email,
        };
        console.log("Login Success:", user.name);
        res.json("Success");
      } else {
        res.status(401).json("Password doesn't match");
      }
    } else {
      res.status(404).json("No Records found");
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.status(200).json({ message: "Logout successful" });
      }
    });
  } else {
    res.status(400).json({ error: "No session found" });
  }
});

app.get("/user", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("Not authenticated");
  }
});
