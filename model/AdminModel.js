const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: "/uploads/Profile_3.jpg",
  },
  adminType: {
    type: String,
  },
  ContactUs_Id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContactUs_Model'
  },]



}, { timestamps: true });



module.exports = mongoose.model("Admin", adminSchema);
