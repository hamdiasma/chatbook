const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(400).json({ msg: `Authentication denied..!` });
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decode) {
      return res.status(400).json({ msg: `Authentication denied..!` });
    }

    const user = await User.findOne({ _id: decode.id });
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = auth;
