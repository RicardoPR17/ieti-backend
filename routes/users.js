const users = require("../controllers/users");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Rutas GET:
router.get("/db/users", verifyToken, users.getUsers);

router.get("/db/user/:document?", verifyToken, users.getAnUser);

// Rutas POST:
router.post("/db/user/register", users.addUser);
router.post("/db/user/login", users.loginUser);

//Rutas PUT:
router.put("/db/user/update", verifyToken, users.updateUser);

//Rutas DELETE:
router.delete("/db/user/delete/:id", verifyToken, users.deleteUser);

module.exports = { router };
