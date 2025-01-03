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
            default: "00",
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        isEmailVerified: {
            type: Number,
            default: 0
        },
        profileImage: {
            type: String,
            default: "/uploads/Profile_3.jpg",
        },
        adminType: {
            type: String,
            default: "User",
        },
        emailOTP: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserModel", userSchema);

