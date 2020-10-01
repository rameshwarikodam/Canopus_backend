const bcrypt = require("bcrypt");
const express = require("express");
const Business_Master = require("../models/business_master").Business_Master;
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");

router.get("/:token", async (req, res) => {
  let token = req.params.token;
  var decode = jwt.decode(token, config.get("jwtPrivateKey"));
  var userId = decode.email_id; // emailId
  await Business_Master.findOne({ shopkeeper_id: userId }, (err, doc) => {
    if (err) {
      return res.send({
        status: "false",
        message: "Invalid request/token."
      });
    } else {
      return res.redirect(
        "http://localhost:3000/masterpassword"
      ); /*
            return res.send({
                status: "true",
                password_token: token
            });
            */
    }
  });
});

router.post("/", async (req, res) => {
  let token = req.body.password_token;
  var decode = jwt.decode(token, config.get("jwtPrivateKey"));
  var user_id = decode.email_id;
  var masterpassword = req.body.password;
  const salt = await bcrypt.genSalt(10);
  masterpassword = await bcrypt.hash(masterpassword, salt);
  Business_Master.updateOne(
    {
      shopkeeper_id: user_id
    },
    {
      $set: {
        master_password: masterpassword
      }
    },
    {
      new: true
    },
    (err, result) => {
      if (err) {
        return res.send({
          status: "false",
          message: "Not able to update password."
        });
      } else {
        return res.send({
          status: "true",
          message: "Succesfully updated password."
        });
      }
    }
  );
});
module.exports = router;
