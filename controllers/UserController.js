const UserModel = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const generateBaseUrl = require("../constant/baseURL").generateBaseUrl;
const generateOTP = require("../constant/GenerateOTP");
const authConfig = require('../constant/authsecrete');
const ContactUsModel = require('../model/ContactUsModel');
const Admin_Model = require("../model/AdminModel");
const { generateAuthToken } = require("../constant/jwtToken");



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

        // Generate OTP
        const otp = generateOTP();
        console.log("otp - ", otp);

        // Save OTP to user
        newUser.emailOTP = otp;
        await newUser.save();

        return res.status(201).json({
            error_code: 201,
            message: "OTP has been sent to your email address.",
            user: {
                id: newUser._id,
                // firstName: newUser.firstName,
                // lastName: newUser.lastName,
                email: newUser.email,
                // adminType: newUser.adminType,
                emailOTP: newUser.emailOTP
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

const OTPVerified = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email) {
            return res.status(400).json({
                error_code: 400,
                message: "Email is required.",
            });
        }

        if (!otp) {
            return res.status(400).json({
                error_code: 400,
                message: "OTP is required.",
            });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: "User not found.",
            });
        }

        // Check if the OTP matches
        if (user.emailOTP === otp) {
            // Set isEmailVerified to 1
            user.isEmailVerified = 1;
            await user.save();

            // Generate a JWT token using `generateAuthToken`
            const token = generateAuthToken(user._id, user.email, user.userType);
            res.setHeader("x-api-key", token);

            return res.status(200).json({
                error_code: 200,
                message: "OTP verified successfully.",
                isEmailVerified: user.isEmailVerified,
                token, // Provide the generated token
            });
        } else {
            return res.status(400).json({
                error_code: 400,
                message: "Invalid OTP.",
            });
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({
            error_code: 500,
            message: "An error occurred during OTP verification.",
        });
    }
};


// ==========================================


const OTPEmailSent = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error_code: 400,
                message: "Email is required.",
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: "User not found.",
            });
        }

        // Save OTP to user
        user.emailOTP = otp;
        await user.save();

        console.log(`OTP sent to ${email}: ${otp}`);

        return res.status(200).json({
            error_code: 200,
            message: "OTP has been sent to your email address.",
            email: user.email,
            emailOTP: user.emailOTP,
        });

    } catch (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({
            error_code: 500,
            message: "An error occurred while sending OTP. Please try again later.",
        });
    }
};

const ResendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate the email
        if (!email) {
            return res.status(400).json({
                error_code: 400,
                message: "Email is required.",
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                error_code: 400,
                message: "Invalid email format.",
            });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: "User not found.",
            });
        }

        // Generate a new OTP
        const otp = generateOTP();

        // Update the OTP in the database
        user.emailOTP = otp;
        await user.save();

        // Log the OTP (for debugging purposes)
        console.log(`New OTP for ${email}: ${otp}`);

        // Return the OTP in the response
        return res.status(200).json({
            error_code: 200,
            message: "OTP has been reset and sent to the user.",
            otp,
        });

    } catch (error) {
        console.error("Error resetting OTP:", error);
        return res.status(500).json({
            error_code: 500,
            message: "An error occurred while resetting OTP. Please try again later.",
        });
    }
};


// ==========================================
// ==========================================


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate the email input
        if (!email) {
            return res.status(400).json({
                error_code: 400,
                message: "Email is required.",
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                error_code: 400,
                message: "Invalid email format.",
            });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: "User not found.",
            });
        }

        // Generate a new OTP
        const otp = generateOTP();

        // Save the OTP in the user's emailOTP field
        user.emailOTP = otp;
        await user.save();

        // Log the OTP for debugging (optional)
        console.log(`Forgot Password OTP for ${email}: ${otp}`);

        // Return the OTP in the response
        return res.status(200).json({
            error_code: 200,
            message: "OTP has been sent to your email address.",
            email: user.email,
            otp,
        });

    } catch (error) {
        console.error("Error in forgot password API:", error);
        return res.status(500).json({
            error_code: 500,
            message: "An error occurred. Please try again later.",
        });
    }
};



const forgetPassOtpVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate the inputs
        if (!email) {
            return res.status(400).json({
                error_code: 400,
                message: "Email are required.",
            });
        }
        if (!otp) {
            return res.status(400).json({
                error_code: 400,
                message: "OTP are required.",
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                error_code: 400,
                message: "Invalid email format.",
            });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: "User not found.",
            });
        }

        // Verify the OTP
        if (user.emailOTP !== otp) {
            return res.status(401).json({
                error_code: 401,
                message: "Invalid OTP.",
            });
        }

        // OTP verified successfully
        return res.status(200).json({
            error_code: 200,
            message: "OTP verified successfully. You can now reset your password.",
            email: user.email,

        });

    } catch (error) {
        console.error("Error in forgetPassOtpVerify API:", error);
        return res.status(500).json({
            error_code: 500,
            message: "An error occurred while verifying OTP. Please try again later.",
        });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Validate inputs
        if (!email) {
            return res.status(400).json({
                error_code: 400,
                message: "Email are required.",
            });
        }

        if (!newPassword) {
            return res.status(400).json({
                error_code: 400,
                message: "new password are required.",
            });
        }

        if (!confirmPassword) {
            return res.status(400).json({
                error_code: 400,
                message: "confirm password are required.",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                error_code: 400,
                message: "New password and confirm password do not match.",
            });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: "User not found.",
            });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            error_code: 200,
            message: "Password has been updated successfully.",
        });

    } catch (error) {
        console.error("Error in resetPassword API:", error);
        return res.status(500).json({
            error_code: 500,
            message: "An error occurred while resetting the password. Please try again later.",
        });
    }
};






// ==========================================
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

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: "No user exists with the provided email address.",
            });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({
                error_code: 403,
                message: "Email not verified. Please verify your email to proceed.",
            });
        }

        // Verify the password directly
        if (password !== user.password) {
            return res.status(400).json({
                error_code: 400,
                message: "Invalid credentials.",
            });
        }

        // Generate JWT token
        const token = generateAuthToken(user._id, user.email, user.userType);
        res.setHeader("x-api-key", token);

        // Respond with the token and user details
        return res.status(200).json({
            error_code: 200,
            message: "Login successful.",
            email: user.email,
            token,
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({
            error_code: 500,
            message: "An error occurred during login.",
        });
    }
};



// ==========================================

const createFacebook = async (req, res) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({ message: 'Access token is required' });
        }

        // Fetch user data from Facebook API
        let response;
        try {
            response = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
        } catch (error) {
            return res.status(400).json({
                message: 'Invalid access token or failed to fetch user info from Facebook',
                error: error.message
            });
        }

        const userData = response.data;

        // Check if user exists by Facebook ID, then email
        let user = await UserModel.findOne({ facebookId: userData.id }) ||
            await UserModel.findOne({ email: userData.email });

        if (user) {
            // Generate JWT token using generateAuthToken
            const token = generateAuthToken(user._id, user.email, user.userTypes);

            await user.save();

            return res.status(200).json({
                message: 'User logged in successfully',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profileImage: user.profileImage || userData.picture.data.url,
                    mobileNumber: user.mobileNumber || '',
                    token
                }
            });
        }

        // Create a new user with a default password
        const newUser = await UserModel.create({
            email: userData.email,
            firstName: userData.name.split(' ')[0],
            lastName: userData.name.split(' ')[1] || '',
            profileImage: userData.picture.data.url,
            registerWith: constant.registerWith.facebook,
            facebookId: userData.id,
            password: "facebook", // Default password
            mobileNumber: ''
        });

        // Generate JWT token for the new user
        const token = generateAuthToken(newUser._id, newUser.email, newUser.userTypes);
        res.setHeader("x-api-key", token);

        await newUser.save();

        return res.status(201).json({
            message: 'New user created successfully',
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                profileImage: newUser.profileImage || userData.picture.data.url,
                mobileNumber: newUser.mobileNumber || '',
                token
            }
        });
    } catch (error) {
        console.error('Error in createFacebook:', error);
        return res.status(500).json({
            error_code: 500,
            message: 'Internal Server Error'
        });
    }
};



// ==========================================


const createGoogle = async (req, res) => {
    try {
        // Extract accessToken from the request body
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({ message: 'Access token is required' });
        }

        // Fetch user data from Google API
        let response;
        try {
            response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
        } catch (error) {
            return res.status(400).json({
                message: 'Invalid access token or failed to fetch user info from Google',
                error: error.message
            });
        }

        const userData = response.data;

        // Check if user exists by Google ID or email
        let user = await UserModel.findOne({ googleId: userData.id }) ||
            await UserModel.findOne({ email: userData.email });

        if (user) {
            // Generate JWT token using generateAuthToken
            const token = generateAuthToken(user._id, user.email, user.userTypes);

            await user.save();

            return res.status(200).json({
                message: 'User logged in successfully',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profileImage: user.profileImage || userData.picture,
                    mobileNumber: user.mobileNumber || '',
                    token
                }
            });
        }

        // Create a new user with plain password
        const newUser = await UserModel.create({
            email: userData.email,
            firstName: userData.given_name,
            lastName: userData.family_name || '',
            profileImage: userData.picture,
            registerWith: constant.registerWith.google,
            googleId: userData.id,
            password: "google", // Plain password
            mobileNumber: ''
        });

        // Generate JWT token for the new user
        const token = generateAuthToken(newUser._id, newUser.email, newUser.userTypes);
        res.setHeader("x-api-key", token);

        await newUser.save();

        return res.status(201).json({
            message: 'New user created successfully',
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                profileImage: newUser.profileImage || userData.picture,
                mobileNumber: newUser.mobileNumber || '',
                token
            }
        });
    } catch (error) {
        console.error('Error in createGoogle:', error);
        return res.status(500).json({
            error_code: 500,
            message: 'Internal Server Error'
        });
    }
};


// ==========================================







// ==========================================
// ==========================================
// === Profile Section ===

const getProfile = async (req, res) => {
    try {
        const id = req.userId;

        const baseUrl = generateBaseUrl(req);
        console.log("baseUrl", baseUrl);

        const user = await UserModel.findById(id).select('firstName lastName mobileNumber email profileImage');

        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: 'User not found'
            });
        }

        const profileImageUrl = `${baseUrl}${user.profileImage}`;
        user.profileImage = profileImageUrl;

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        return res.status(500).json({
            error_code: 500,
            message: 'Internal server error'
        });
    }
};




const postContactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name) {
            return res.status(400).json({
                error_code: 400,
                message: 'Name message are required fields.'
            });
        }
        if (!email) {
            return res.status(400).json({
                error_code: 400,
                message: 'email are required fields.'
            });
        }
        if (!message) {
            return res.status(400).json({
                error_code: 400,
                message: 'message are required fields.'
            });
        }

        // Create a new contact message
        const newContactUs = new ContactUsModel({
            name,
            email,
            message
        });

        // Save the message to the database
        await newContactUs.save();

        await Admin_Model.findOneAndUpdate(
            {},
            { $push: { ContactUs_Id: newContactUs._id } },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: 'Message submitted successfully.',
            data: newContactUs
        });
    } catch (error) {
        console.error('Error saving contact message:', error.message);
        return res.status(500).json({
            error_code: 500,
            message: 'An error occurred while submitting the message.'
        });
    }
};



const changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        console.log("userId", userId);
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).json({
                error_code: 400,
                message: "Current password is required.",
            });
        }

        if (!newPassword) {
            return res.status(400).json({
                error_code: 400,
                message: "New password is required.",
            });
        }

        if (!confirmNewPassword) {
            return res.status(400).json({
                error_code: 400,
                message: "Confirm new password is required.",
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                error_code: 400,
                message: "New password and confirm new password do not match.",
            });
        }

        // Find user by ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                error_code: 404,
                message: "User not found.",
            });
        }

        // Verify the current password
        if (user.password !== currentPassword) {
            return res.status(401).json({
                error_code: 401,
                message: "Current password is incorrect.",
            });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            error_code: 200,
            message: "Password changed successfully.",
        });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            error_code: 500,
            message: "Internal Server Error: Failed to change password.",
        });
    }
};


// ==========================================
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
    OTPVerified,
    OTPEmailSent,
    ResendOTP,
    forgotPassword,
    forgetPassOtpVerify,
    resetPassword,
    userLogin,
    getProfile,
    postContactUs,
    changePassword,
    createFacebook,
    createGoogle,
};

