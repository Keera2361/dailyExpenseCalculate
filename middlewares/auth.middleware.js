const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // validate session stored server-side
    const session = await Session.findOne({ jti: decoded.jti, userId: decoded.id });
    if (!session || session.revoked) {
      return res.status(401).json({ message: "Token revoked" });
    }

    // attach minimal user info
    req.user = { id: decoded.id, jti: decoded.jti };

    session.lastActiveAt = new Date();
    await session.save();

    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};
