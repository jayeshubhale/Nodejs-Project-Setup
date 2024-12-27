const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers['x-api-key'];

  if (!token) {
    return res.status(400).json({ error_code: 400, message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminType = decoded.adminType;
    if (!adminType) {
      return res.status(400).json({ error_code: 400, message: 'User type not found in token' });
    }

    req.adminType = adminType;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else {
      return res.status(500).json({ error: 'An error occurred during authentication' });
    }
  }
};


// ---------------------------------------------------------------------

const UserForauthenticateUser = (req, res, next) => {
  const token = req.headers['x-api-key'];
  console.log(token)
  if (!token) {
    return res.status(200).json({ error_code: 400, message: 'Please provide token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};


module.exports = {
  authenticateUser,
  UserForauthenticateUser,
};
