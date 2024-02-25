const users = require("../controllers/users");
const express = require("express");
const router = express.Router();

// Rutas GET:
router.get("/db/users", users.getUsers);

router.get("/db/user/:document?", users.getAnUser);

// Rutas POST:
router.post("/db/user_new", users.addUser);

module.exports = { router };