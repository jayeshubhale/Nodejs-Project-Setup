const Admin = require("../model/AdminModel");
const baseURL = require("../constant/baseURL");
 const jwtToken = require("../constant/jwtToken");
// const { generateAuthToken } = require("../constant/jwtToken")
const Admin_Model = require("../model/AdminModel");




// const createAdmin = async function (req, res) {
//   try {
//     let baseUrl = baseURL.generateBaseUrl(req);
//     const saltRounds = 8;
//     const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
//     let obj = {
//       name: req.body.name ? req.body.name : undefined,
//       number: req.body.number ? req.body.number : undefined,
//       email: req.body.email ? req.body.email : undefined,
//       password: encryptedPassword ? encryptedPassword : undefined,
//       adminType: "Admin"
//     };
//     if (req.files.length > 0) {
//       obj["profileImage"] = baseUrl + "/uploads/" + req.files[0].filename;
//     }
//     await Admin.create(obj);
//     return res
//       .status(200)
//       .json({ error_code: 200, message: "admin created successfully..!" });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ error_code: 500, message: "error inside create admin..!" });
//   }
// };
// ----------------------------------------------------------------------------------------------------------------------

const admin_login = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error_code: 400, message: "Invalid admin" })
    }
    const decrypPassword = admin.password;

    const pass = await bcrypt.compare(password, decrypPassword);
    if (!pass) {
      return res.status(400).json({ error_code: 400, message: "Password Incorrect" });
    }
    const token = generateAuthToken(admin._id, email, admin.adminType);
    // const token = generateAuthToken(ceo._id, email, ceo.adminType)
    res.setHeader("x-api-key", token);
    {
      return res.status(201).json({
        error_code: 200,
        message: "admin login successfully",
        token: token,
      });
    }
  } catch (error) {
    return res.status(500).json({ error_code: 500, message: error.message });
  }
};

// ----------------------------------------------------------------------------------------------------------------------

const update_admin = async function (req, res) {
  try {
    let adminId = req.userId;
    let admin = await Admin.findById(adminId);
    let obj = {
      name: req.body.name ? req.body.name : admin.name,
      email: req.body.email ? req.body.email : admin.email,
      number: req.body.number ? req.body.number : admin.number,
    };

    await Admin.findOneAndUpdate(
      { _id: adminId },
      { $set: obj },
      { new: true }
    );

    return res.status(200).json({
      error_code: 200,
      message: "Admin updated successfully",
      UpdatedAdmin: obj,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error_code: 500, message: error.message });
  }
};

// ----------------------------------------------------------------------------------------------------------------------

const update_admin_image = async function (req, res) {
  try {
    let adminId = req.userId;
    let baseUrl = baseURL.generateBaseUrl(req);
    let admin = await Admin.findById(adminId);

    if (!req.files || req.files.length === 0) {
      return res.json({ error_code: 400, message: "No image uploaded" });
    }

    let profileImageUrl = "/uploads/" + req.files[0].filename;

    await Admin.findOneAndUpdate(
      { _id: adminId },
      { $set: { profileImage: profileImageUrl } },
      { new: true }
    );

    return res.status(200).json({
      error_code: 200,
      message: "Admin profile image updated successfully",
      profileImage: profileImageUrl
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error_code: 500, message: "Internal server error" });
  }
};

// ----------------------------------------------------------------------------------------------------------------------


// const update_admin = async function (req, res) {
//   try {
//     let adminId = req.userId;
//     let baseUrl = baseURL.generateBaseUrl(req);
//     let admin = await Admin.findById(adminId);
//     let obj = {
//       name: req.body.name ? req.body.name : admin.name,
//       email: req.body.email ? req.body.email : admin.email,
//       number: req.body.number ? req.body.number : admin.number,
//     };
//     if (req.files.length > 0) {
//       obj["profileImage"] = baseUrl + "/uploads/" + req.files[0].filename;
//     }
//     await Admin.findOneAndUpdate(
//       { _id: adminId },
//       { $set: obj },
//       { new: true }
//     );

//     return res.status(200).json({
//       error_code: 200,
//       message: "admin update successfully...",
//       obj,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error_code: 500, message: error });
//   }
// };

// ----------------------------------------------------------------------------------------------------------------------

const change_password = async function (req, res) {
  try {
    let adminId = req.userId;
    const encryptedPassword = await bcrypt.hash(req.body.confirmPassword, 8);
    let obj = {
      password: encryptedPassword ? encryptedPassword : undefined
    }
    await Admin.findByIdAndUpdate(
      { _id: adminId },
      { $set: obj },
      { new: true }
    );
    return res.status(200).json({ error_code: 200, message: 'password update successfully..!' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error_code: 500, message: 'error inside change password' })
  }
};

//------------------------------------------------------------------------  

const getAdminProfile = async function (req, res) {
  try {
    let adminId = req.userId;
    let baseUrl = baseURL.generateBaseUrl(req);

    let admin = await Admin.findById(adminId);
    let obj = {
      name: admin.name ? admin.name : undefined,
      email: admin.email ? admin.email : undefined,
      number: admin.number ? admin.number : undefined,
      profileImage: admin.profileImage ? `${baseUrl}${admin.profileImage}` : undefined
    };

    return res.status(200).json({ error_code: 200, obj });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error_code: 500, message: 'error inside getAdminProfile in Admin controller..!' });
  }
};

//----------------------------------------------------------------------




module.exports = {
  // createAdmin,
  admin_login,
  update_admin,
  change_password,
  getAdminProfile,
  update_admin_image,


};

