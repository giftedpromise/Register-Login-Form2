const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const UserModel = require("./model/User");

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
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
    res.status(500).json({ error: error.message });
  }
});
/* mongoose.connect(
  "mongodb+srv://giftedpromise:Promisengani1593%23@cluster0.ultm5qe.mongodb.net/crud"
);
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
const userModel = mongoose.model("emp", userSchema);
const emp1 = new userModel({
  name: "Promise",
  age: 23,
});
emp1.save();
app.listen(3001, () => {
  console.log("Server is Running!!!");
});

*/
