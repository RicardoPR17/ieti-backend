const orders = require("../controllers/orders");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Rutas GET:
router.get("/db/orders", verifyToken, orders.getAllOrders);

// Rutas POST:
router.post("/db/orders/new", verifyToken, orders.createOrder);

// Rutas PUT:
router.put("/db/orders/update", verifyToken, orders.deliverOrder);

module.exports = { router };
