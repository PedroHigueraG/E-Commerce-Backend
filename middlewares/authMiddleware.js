const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 1. Grab the token from the request header
  const authHeader = req.header('Authorization');

  // 2. Check if the header exists and is formatted correctly (Bearer token)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No valid token provided.' });
  }

  try {
    // 3. Extract the actual token string
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using your secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded user payload (which includes the user ID) to the request object
    req.user = decoded;

    // 6. Move on to the actual controller function
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;