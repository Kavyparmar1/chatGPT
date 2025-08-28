const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerController(req, res) {
  const {
    fullName: { firstName, lastName },
    email,     
    password,
  } = req.body;
  const existingUser = await userModel.findOne({ email });
 
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashpassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
      fullName:{
        firstName,lastName
      },
      email,
      password: hashpassword,
  })
  const token = jwt.sign({id:user._id},process.env.JWT_SEC_KEY)
  res.cookie("token",token)

  res.status(201).json({
    message:"register  successfully",
    user:{
        email:user.email,
        _id:user._id,
        fullName:user.fullName,
    }
  })
}

async function  loginController(req,res) {
    const { email , password } = req.body;
    const emailCheack = await userModel.findOne({
        email
    })
    if(!emailCheack){
                return res.status(400).json({message:"user not found"})
            }

    const passCheak = await bcrypt.compare(password, emailCheack.password);
    if(!passCheak){
        return res.status(401).json({message:"invalid password"})
    }
    const token = jwt.sign({id:emailCheack._id},process.env.JWT_SEC_KEY)
    res.cookie('token',token)
   return res.status(201).json({
    message:"login successfully",
    fullName:emailCheack.fullName,
    email:emailCheack.email,
    id:emailCheack._id
   })
}
module.exports = {
  registerController,
  loginController
};
