const express = require("express");
const router = express.Router();
const Order = require("../model/order_model");

// Create a new order
router.post("/create", async (req, res) => {
    console.log("order create callled ....")
    try {
        const { userId,items, totalAmount, shippingDetails } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty!" });
        }

        // Create new order
        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            shippingDetails,
            status: "Pending", // Default status
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all orders (Admin)
router.get("/allOrders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetching orders error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//loged user orders
router.get("/getOrders", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.session.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetching orders error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// Get order by ID
router.get("/:orderId", async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found!" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Fetching order error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update order status (Admin)
router.put("/update/:orderId", async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ error: "Order not found!" });
        }

        res.status(200).json({ message: "Order updated successfully!", order });
    } catch (error) {
        console.error("Order update error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete order
router.delete("/delete/:orderId", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found!" });
        }
        res.status(200).json({ message: "Order deleted successfully!" });
    } catch (error) {
        console.error("Order deletion error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
