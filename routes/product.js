const express = require('express');
const router = express.Router();
const Product = require('../model/product_model')

const multer = require("multer");
const path = require("path");


//get all Product
router.get('/allproduct',async(req,res)=>{
    const productdata =await Product.find();
    console.log(productdata)
    res.send(productdata);
})

//search products
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    const products = await Product.find({
      p_name: { $regex: query, $options: "i" } // Case-insensitive search
    }).limit(10); // Limit results for better performance

    res.json({ products });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//get all category 
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct("category"); // Get unique category names
        res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Get products by category
router.get("/category/:category", async (req, res) => {
  try {
      const { category } = req.params;
      
      // Find products matching the given category
      const products = await Product.find({ category });

      if (products.length === 0) {
          return res.status(404).json({ message: "No products found in this category." });
      }

      res.json({ products });
  } catch (error) {
      console.error("Error fetching category products:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


//get Product by name
router.post('/getproductbyname',async(req,res)=>{
    const {p_name} = req.body;
    const productdata = await Product.findOne({p_name:p_name});

    res.send(productdata);
})

//get Product by id
router.get('/productbyid/:id',async(req,res)=>{
    const {id} = req.params;
     const productdata =await Product.find({_id:id});
    res.send(productdata);
})


// Set storage engine for Multer (upload to assets folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "assets/"); // Save files in "assets" folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    },  
  });
  
  const upload = multer({ storage });
  
  // Create New Product (with Image Upload)
  router.post("/newproduct", upload.single("img"), async (req, res) => {
    try {
      const { p_name, price, category, sizes } = req.body;
      const imgPath = req.file ? `/assets/${req.file.filename}` : ""; // Store image path
  
      const newProduct = new Product({
        p_name,
        price,
        category,
        sizes: sizes, // Convert comma-separated string to array
        img: imgPath, // Store image path in MongoDB
      });
  
      await newProduct.save();
      res.json({ success: true, message: "Product added!", product: newProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  });

//update product
router.put("/updateproduct/:id", upload.single("img"), async (req, res) => {
    try {
      const { id } = req.params;
      const { p_name, price, category, sizes } = req.body;
      const updatedData = {
        p_name,
        price,
        category,
        sizes: sizes, // Convert string to array
      };
  
      if (req.file) {
        updatedData.img = `/assets/${req.file.filename}`; // Store new image path
      }
  
      const updatedProduct = await Product.findOneAndUpdate({ _id: id }, { $set: updatedData }, { new: true });
  
      res.json({ success: true, message: "Product updated!", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  });

//delete product
router.delete('/deleteproduct/:id',async(req,res)=>{
    const {id} = req.params;
    const product_data = await Product.deleteOne({_id : id});
    res.send(product_data);
})


module.exports = router