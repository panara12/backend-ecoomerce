const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      img:{type:String},
      size:{type:String},
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingDetails: {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    gstNo: { type: String, required: false }, // GST No. is now optional
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  status: { type: String, enum: ["Pending", "Shipping", "On the Way","Delivered"], default: "Pending" },
  paymentmethod:{
    type:String,
    default: "cash on delivery"
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
