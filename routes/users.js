const users = require("../controllers/users");
const express = require("express");
const router = express.Router();

// Rutas GET:
router.get("/db/users", users.getUsers);

router.get("/db/user/:document?", users.getAnUser);

// Rutas POST:
router.post("/db/user_new", users.addUser);

//Rutas PUT:

router.put("/db/user/update", users.updateUser);

//Rutas DELETE:

router.delete("/db/user/delete/:id", users.deleteUser);

module.exports = { router };