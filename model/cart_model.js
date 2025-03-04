const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        size: { type: String, required: true }, // Store selected size
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate total price before saving
CartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  next();
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
