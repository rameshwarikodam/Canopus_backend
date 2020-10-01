const express = require("express");
const router = express.Router();
const path = require("path");
const upload = require("express-fileupload");
const xlsx = require("xlsx");
const Product_Master = require("../models/product_master").Product_Master;
const Product_Catagory = require("../models/product_catagory").Product_Catagory;

router.get("/get/:filename", (req, res) => {
    res.redirect("/api/addproduct/download/" + req.params.filename);
});
router.get("/download/:file(*)", (req, res) => {
    var file = req.params.file;
    var fileLocation = path.join("./config", file);
    console.log(fileLocation);
    res.download(fileLocation, file);
});

router.use(upload({
    useTempFiles: true,
    tempFileDir: './config/'
}));
router.post("/upload", (req, res) => {
    if (req.files) {
        var file = req.files.file,
            filename = file.name;
        file.mv("./config/" + filename, function (err) {
            if (err) {
                console.log(err);
                res.send("Error occured..!");
            } else {
                res.redirect("/api/addproduct/parsefile/" + filename);
            }
        });
    } else res.send("file not found..");
});

router.get("/parsefile/:filename", async (req, res) => {
    const workbook = xlsx.readFile("./config/" + req.params.filename);
    const sheet_names = workbook.SheetNames;
    var count = 0;
    const products = sheet_names.forEach(async prod_cat_name => {
        const products = xlsx.utils.sheet_to_json(workbook.Sheets[prod_cat_name]);
        let prod_cat = await Product_Catagory.findOne({
            product_catagory_name: prod_cat_name
        });
        if (!prod_cat) {
            prod_cat = Product_Catagory({
                product_catagory_name: prod_cat_name
            });
            prod_cat.save();
        }
        products.forEach(product => {
            var prod = new Product_Master({
                product_catogery_id: prod_cat.id,
                product_name: product.Product_Name,
                description: product.Description,
                unit_of_measurement: product.Unit_of_Measurement
            });
            prod.save(function (err) {
                if (!err) {
                    console.log("Product" + count++);
                } else console.log(err);
            });
        });
    });
    res.send({
        status: "true",
        message: "Products Added.."
    })
});

module.exports = router;