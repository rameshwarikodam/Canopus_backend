const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const login = require("./routes/login");
const forgetpassword = require("./routes/forgetpassword");
const resetpassword = require("./routes/resetpassword");
const addshopkeeper = require("./routes/addshopkeeper");
const register = require("./routes/register");
const masterpassword = require("./routes/masterpassword");
const listbusiness = require("./routes/listbusiness");
const addproduct = require("./routes/addproduct");
const getproduct = require("./routes/getproducts");
const home = require("./routes/home");
const cart =require("./routes/cart")

const app = express();
app.use(express.json());
mongoose.set("useCreateIndex", true);
mongoose
  .connect(
    'mongodb://<ketankatore>:<ketan2018>@ds135537.mlab.com:35537/canopus-db', {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/forgetpassword", forgetpassword);
app.use("/api/resetpassword", resetpassword);
app.use("/api/addshopkeeper", addshopkeeper);
app.use("/api/masterpassword", masterpassword);
app.use("/api/listbusiness", listbusiness);
app.use("/api/addproduct", addproduct);
app.use("/api/getproduct", getproduct);
app.use("/api/home", home);
app.use("/api/cart", cart);

app.get("", (req, res) => {
  res.send("Welcome to Canopus World..!")
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));