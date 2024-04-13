const providers = require("../controllers/providers");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Rutas GET:
router.get("/db/providers", verifyToken, providers.getAllProviders);

router.get("/db/providers/:namePharmacy", verifyToken, providers.getProvider);

router.get("/db/providers/medicine/:medicine", verifyToken, providers.getMedicineProvider);

// Rutas POST:
router.post("/db/providers/new", verifyToken, providers.createProvider);

// Rutas PUT:
router.put("/db/providers/update", verifyToken, providers.updateMedicineProvider);

router.put("/db/providers/add", verifyToken, providers.addMedicine);

// Rutas DELET
router.delete("/db/providers/:pharmacy", verifyToken, providers.deleteProvider);

router.delete("/db/providers/:pharmacy/:medicine", verifyToken, providers.deleteMedicine);

module.exports = { router };