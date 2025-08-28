const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");


//auth middleware(proctected)
async function authUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "unauthorized user" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SEC_KEY);
    const user = await userModel.findById(decode.id);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  authUser,
}; 
