const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        mobileNumber: {
            type: String,
        },
        email: {
            type: String,
        },
        profileImage: {
            type: String,
            default: "/uploads/Profile_3.jpg",
        },
        adminType: {
            type: String,
            default: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserModel", userSchema);

