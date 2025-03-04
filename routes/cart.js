const express = require("express")
const Cart = require('../model/cart_model')

const router = express.Router();

/** Get User's Cart */
router.get("/getcart", async (req, res) => {
  console.log("get cart called.........")
  try {
    const cart = await Cart.findOne({ userId: req.session.user.id }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




//add to cart 
// router.post("/addcart", async (req, res) => {
//   console.log("Add to cart called...");

//   // Ensure user is logged in
//   if (!req.session.user) {
//     return res.status(401).json({ error: "User not authenticated" });
//   }

//   const { productId, quantity = 1, price } = req.body; // Default quantity to 1

//   try {
//     let cart = await Cart.findOne({ userId: req.session.user.id });

//     // If no cart exists, create a new one and add the item
//     if (!cart) {
//       cart = new Cart({
//         userId: req.session.user.id,
//         items: [{ productId, quantity, price }],
//         totalPrice: quantity * price
//       });
//     } else {
//       // Check if the item already exists in the cart
//       const existingItem = cart.items.find((item) => item.productId.toString() === productId);

//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         cart.items.push({ productId, quantity, price });
//       }

//       // Update total price
//       cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
//     }

//     await cart.save();

//     console.log("Updated Cart:", cart);
//     res.json({ message: "Item added to cart", cart });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });




router.post("/addcart", async (req, res) => {
  console.log("Add to cart called...");

  if (!req.session.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { productId, size, quantity = 1, price } = req.body; // Receive selected size

  try {
    let cart = await Cart.findOne({ userId: req.session.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.session.user.id,
        items: [{ productId, size, quantity, price }],
        totalPrice: quantity * price
      });
    } else {
      // Check if the item with the same productId and size already exists
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, size, quantity, price });
      }

      // Update total price
      cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    }

    await cart.save();

    console.log("Updated Cart:", cart);
    res.json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});











router.put("/updatecart", async (req, res) => {
  console.log("Update cart called...");
  const { items } = req.body;

  // Find the cart for the logged-in user
  const cart = await Cart.findOneAndUpdate({ userId: req.session.user.id },{$set : items},{new : true});
    console.log(cart);
    res.send(cart);

});



/** Remove Item */
router.delete("/removecart/:id/:size", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.session.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.id || item.size !== req.params.size);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/** Clear Cart */
router.delete("/checkout",  async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.session.user.id });
    res.json({ message: "Checkout successful, cart cleared!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports =  router
