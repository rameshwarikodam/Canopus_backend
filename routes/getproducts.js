const express = require("express");
const router = express.Router();

const Product_Master = require("../models/product_master").Product_Master;
const Product_Catagory = require("../models/product_catagory").Product_Catagory;


router.get('/random', async (req, res) => {
    var count = await Product_Master.countDocuments();
    var random = Math.floor(Math.random() * count);
    var randomElement = await Product_Master.find().select('product_name price _id').limit(10).skip(random);
    if (!count)
        return res.send({
            status: "False",
            message: "Something went wrong" + err
        })
    else {
        res.send({
            status: "true",
            product_name: randomElement
        })
    }
});


router.get('/product/:id', async (req, res) => {

    Product_Master.findById(req.params.id, function (err, prod) {
        if (err) {
            return res.send({
                status: "false",
                message: "Product not found"

            })
        } else
            return res.send({
                status: "true",
                product: prod
            })
    });

})

router.get("/listbycatagory/:catname", (req, res) => {
    Product_Catagory.find({product_catagory_name:req.params.catname}).select("_id")
    .then(pid=>{ 
    Product_Master.find({"product_catogery_id" : pid })
        .exec()
        .then(data => {
            if (!data)
                return res.send({
                    status: "false",
                    message: "Something went wrong." + err
                });
            else {
                return res.send({
                    status: "true",
                    products: data
                });
            }
        })
        .catch(err => {
            return res.send({
                status: "false",
                message: "Something went wrong." + err
            });
        })
    })
    .catch(err => {return res.send({
        status : "false",
        message:'cateory does not exist'+err
    })});
});
module.exports = router;