require("dotenv").config();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://dah-romy:admin@cluster0.slq2s.mongodb.net/i-anatra", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

require("../models/User");
require("../models/Message");
require("../models/Departement");
require("../models/Conversation");
require("../models/Participant");

require("../app");
