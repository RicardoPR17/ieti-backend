const orders = require("../controllers/orders");
const express = require("express");
const router = express.Router();

// Rutas GET:
router.get("/db/orders", orders.getAllOrders);

// Rutas POST:
router.post("/db/orders/new", orders.createOrder);

// Rutas PUT:
router.put("/db/orders/:id", orders.deliverOrder);

module.exports = { router };
