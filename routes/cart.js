const express = require("express");
const router = express.Router();
const Customer_Cart=require("../models/customer_cart").Customer_Cart;
const User_Master = require('../models/user_master').User_Master;
const Product_Master = require('../models/product_master').Product_Master;
router.use(express.json());
router.post("/addtocart", async function(req, res)  {
	const productPrice = await Product_Master.findOne({_id:req.body.product_id});
	console.log(productPrice.price);
	const cartInfo = await Customer_Cart.find({customer_id : req.body.customer_id})
    if(cartInfo.length == 0){
		let cart1 =new Customer_Cart({ customer_id : req.body.customer_id,
					 products : [ {
						 product_id : req.body.product_id,
						 price : productPrice.price,
					  } ],
					})
                    cart1.save();
                    console.log("Cart info="+cart1);
					res.send("cart added"+ cart1)
			}
        else {
	const product = await Customer_Cart.find({ customer_id : req.body.customer_id, 'products.product_id' : req.body.product_id});
	if(product.length == 0){
			Customer_Cart.update({customer_id : req.body.customer_id },
				// {$addToSet : {"items" : {'item_name' : "my_item_two" , 'price' : 1 }} } 
		{ $addToSet : {
			 products : {
				'product_id' : req.body.product_id,
				 'price' : productPrice.price
			 }
			
		 } }, function(err, prod2){
			 if(err){
				 res.send({status:false,message:"Error at adding a product to cart"});
			 }
			 else
			 res.send({status:true,message:"Item added to cart."})
		 });
	}
	else {
		Customer_Cart.update({customer_id : req.body.customer_id, 'products.product_id' : req.body.product_id},
	{$inc : {'products.$.quantity' : 1}},
			  function(err,pid){
				if(err) {
                    res.send({status:false,message:"Error to update quantity."});
                }
				else {
				res.send({status:true,message:"Quantity is increased\n"});
				}
		});
	}
}		
});

router.get('/checkout/:cid', async function(req, res){
	const checkout = await Customer_Cart.findOne({customer_id : req.params.cid});
	console.log(checkout)
	if(checkout.length == 0){
		res.send("Customer does not exist");
	}
	else{
		let total = 0;
		let length = checkout.products.length;
		console.log(length)
		for(i = 0 ; i < length; i++){
			total += (checkout.products[i].price * checkout.products[i].quantity);
		}
		res.send({status:true,checkoutTotal : total});
	}
})

// $cond: { if: { $gte: [ "$qty", 250 ] }, then: 30, else: 20 }

router.get('/decreament/:cid/:pid', async function(req, res){
	Customer_Cart.update({customer_id : req.params.cid, 'products.product_id' : req.params.pid},
	{$inc : {'products.$.quantity' : -1}},
		function(err, data){
		if(err){
			return res.send("err in deleting address");
		}
		res.send(data)
	});
	})

router.get('/remove/:cid/:pid', async function(req, res){
await Customer_Cart.update({customer_id:req.params.cid, 'products.product_id' : req.params.pid},
	{$pull : { products : {product_id : req.params.pid }}}, 
function(err, data){
	if(err){
		return res.send("err in deleting address");
	}
	res.send(data);
});
})

module.exports=router;