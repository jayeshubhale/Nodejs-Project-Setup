const UserModel = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const generateBaseUrl = require("../constant/baseURL").generateBaseUrl;



const userRegister = async function (req, res) {
    try {
        const { firstName, lastName, password, email } = req.body;

        if (!firstName) {
            return res.status(400).json({
                error_code: 400,
                message: "First name is required.",
            });
        }

        if (!lastName) {
            return res.status(400).json({
                error_code: 400,
                message: "Last name is required.",
            });
        }

        if (!password) {
            return res.status(400).json({
                error_code: 400,
                message: "Password is required.",
            });
        }

        if (!email) {
            return res.status(400).json({
                error_code: 400,
                message: "Email is required.",
            });
        }

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                error_code: 409,
                message: "Email is already registered.",
            });
        }

        // Create a new user
        const newUser = await UserModel.create({
            firstName,
            lastName,
            password,
            email,
        });

        // Respond with the newly created user (excluding sensitive fields)
        return res.status(201).json({
            error_code: 201,
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                // mobileNumber: newUser.mobileNumber,
                // profileImage: newUser.profileImage,
                password: newUser.password,
                adminType: newUser.adminType,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error_code: 500,
            message: "An error occurred during registration.",
        });
    }
};

// ==========================================

const userDelete = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error_code: 400, message: "User ID is required." });
        }

        const user = await UserModel.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ error_code: 404, message: "User not found." });
        }

        res.status(200).json({ error_code: 200, message: "User deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error_code: 500, message: "An error occurred while deleting the user." });
    }
};


const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error_code: 400, message: "User ID is required." });
        }

        // Find the user by ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error_code: 404, message: "User not found." });
        }
        const baseUrl = generateBaseUrl(req);
        console.log("baseUrl", baseUrl);

        const profileImageUrl = `${baseUrl}${user.profileImage}`;

        res.status(200).json({
            error_code: 200,
            message: "User found successfully.",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                adminType: user.adminType,
                profileImage: profileImageUrl,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error_code: 500, message: "An error occurred while retrieving the user." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await UserModel.find();

        if (users.length === 0) {
            return res.status(404).json({ error_code: 404, message: "No users found." });
        }

        const baseUrl = generateBaseUrl(req);  // Generate base URL
        res.status(200).json({
            error_code: 200,
            message: "Users retrieved successfully.",
            users: users.map(user => ({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                adminType: user.adminType,
                profileImage: user.profileImage ? `${baseUrl}${user.profileImage}` : null,  // Append base URL if profile image exists
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error_code: 500, message: "An error occurred while retrieving users." });
    }
};


// ==========================================


const userLogin = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                error_code: 400,
                message: "Email is required.",
            });
        }

        if (!password) {
            return res.status(400).json({
                error_code: 400,
                message: "Password is required.",
            });
        }

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: "User not found.",
            });
        }

        // Verify the password (assuming plain text passwords are stored)
        if (password !== user.password) {
            return res.status(400).json({
                error_code: 400,
                message: "Invalid email or password.",
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            "your_secret_key",
            { expiresIn: "1h" }

        );

        // Respond with the token and user details
        return res.status(200).json({
            error_code: 200,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                adminType: user.adminType,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error_code: 500,
            message: "An error occurred during login.",
        });
    }
};


















// ==========================================
// ==========================================
// ==========================================
// ==========================================
// ==========================================
// ==========================================


//----------------------------------------------------------------------




module.exports = {
    userRegister,
    userDelete,
    getUserById,
    getAllUsers,
    userLogin,
};

