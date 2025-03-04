const mongoose = require("mongoose");
const productSchema  = new mongoose.Schema({
    p_name:{
        type:String
    },
    price:{
        type:Number
    },
    sizes:{
        type:String
    },
    category:{
        type:String
    },
    img:{
        type:String
    },
    createdAt: { type: Date, default: Date.now },
})

const Product = mongoose.model("Product",productSchema);
module.exports =  Product