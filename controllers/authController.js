const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {

  const users = await User.find({});
  if (users.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const newUser = new User({
      email: "admin@i-anatra.io",
      password: await bcrypt.hash("admin", salt),
      lastname: "Admin",
      firstname: "Admin"
    });

    await newUser.save();
  }

  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) throw "Verifier votre adresse email.";

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw "Verifier votre mot de passe.";

  user.status = true;
  await user.save();

  const payload = { id: user.id };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: 36000
    },
    (err, token) => {
      if (err) throw err;
      res.json({
        message: `Bienvenue sur i-anatra.`,
        token,
        role: user.role
      });
    }
  );
};

exports.logout = async (req, res) => {
  const { token } = req.body;

  const payload = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: payload.id });

  if (!payload) throw "Token non valide.";

  user.status = false;
  await user.save();

  res.json({
    message: "Bye!"
  });
};

exports.verify = async (req, res) => {
  const { token } = req.body;
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) throw "Token expire.";
    res.json({
      message: "Token active."
    });
  } catch (error) {
    throw "Erreur.";
  }
};
