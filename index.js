const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const morgan = require('morgan');

const colors = require('colors');
const multer = require("multer");
const path = require('path');

const Admin = require("./model/AdminModel");

// -------------------------------------------------------------------------------

const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');

// -------------------------------------------------------------------------------


const bcrypt = require("bcryptjs");

dotenv.config();
const cors = require('cors');
const app = express();
app.use(cors());

// +++++++++++++++++++++++

// Define adminRegistration function before connectDb
const adminRegistration = async () => {
  try {
    let obj = {
      name: "Jayesh Ubhale",
      number: "9112603100",
      email: "jayeshubhale45@gmail.com",
      password: "Jayesh@45",
      adminType: "Admin"
    };
    await Admin.create(obj);
    console.log("Admin created successfully..!".bgYellow.black.bold);
  } catch (error) {
    console.log("Error inside create admin:", error);
  }
};

// -------------------------------------------

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB is connected..!".bgMagenta.bold);

    const port = process.env.PORT || 4500;

    app.listen(port, "192.168.0.176", () => {
      console.log(`Your Express app is running on PORT : ${port}`.bgCyan.bold);
    });

    const admins = await Admin.find({});
    if (admins.length === 0) {
      await adminRegistration();
    }
    else {
      console.log("An Admin is already Existed".bgBlue.bold);
    }
  } catch (err) {
    console.log('Error inside db connection:', err);
    process.exit(1);
  }
}

connectDb();

// -------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

app.use(express.json());
app.use(morgan('dev'));

const upload = multer({ storage: storage });
app.use(upload.any());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((error, req, res, next) => {
  const message = `This is the Unexpected field --> ${error.field}`;
  return res.status(500).send(message);
});

// Mount routes

app.use('/', adminRoute);
app.use('/', userRoute);





