const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const Login = require("../models/login").Login;
const User_Master = require("../models/user_master").User_Master;
const User_Address = require("../models/user_address").User_Address;
const transporter = require("../models/mail").transporter;
const express = require("express");
// const app = express.Router();
const _ = require("lodash");
const config = require("config");
const app = express();
app.use(express.json());
const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/demoDB', { useNewUrlParser: true } )
	.then( () => console.log("All is well..."))
	.catch(err => console.error(err))
app.post("/pre", async (req, res) => {
  let user = await User_Master.findOne({
    email_id: req.body.email_id
  });
  if (user)
    return res.send({
      status: "false",
      message: "User already registred"
    });
  user = await User_Master({
    email_id: req.body.email_id,
    mobile_number: req.body.mobile_number
  });
  let login = await Login({
    email_id : req.body.email_id,
    password : req.body.password
  })
  const token = user.generateAuthToken();
  console.log(token);
  const mailData = {
    to: user.email_id,
    from: config.get("myEmail"),
    subject: "Verify User Acccount...!",
    text: "Click the Following link to to verify your user account..\n\n\thttps://canopus-api.herokuapp.com/api/register/verifyemail/" +
      token
  };
  user.save(function (err) {
    if (err) {
      return res.send({
        status: "false",
        message: "Something went wrong." + err
      });
    } else {
      login.save();
      transporter.sendMail(mailData, function (err) {
        if (!err) {
          return res.send({
            status: "true",
            message: "Verification link send to your email."
          });
        }
        if (err)
          return res.send({
            status: "false",
            message: "Something went wrong." + err
          });
      });
    }
  });
});

app.get("/verifyemail/:token", async (req, res) => {
  let token = req.params.token;
  console.log(token);
  try {
    var decode = jwt.decode(token, "canopuskey");
  } catch (err) {
    console.log("Error");
    return res.send({
      status: false,
      message: "Invalid token"
    });
  }
  console.log(decode);
  var userId = decode.email_id; // emailId
  console.log(userId);
  await User_Master.findOneAndUpdate({
      email_id: userId
    }, {
      $set: {
        is_verified: true
      }
    },
    (err, doc) => {
      if (!doc) {
        return res.send({
          status: false,
          message: "User Not Exist"
        });
      } else {
        if (doc.is_verified) {
          return res.send({
            status: false,
            message: "User already verified.."
          });
        } else
          return res.send({
            status: true,
            message: "verified...!"
          });
      }
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));