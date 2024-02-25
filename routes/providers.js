const providers = require("../controllers/providers");
const express = require("express");
const router = express.Router();

// Rutas GET:
router.get("/db/providers", providers.getAllProviders);

router.get("/db/providers/:namePharmacy", providers.getProvider);

router.get("/db/providers/medicine/:medicine", providers.getMedicineProvider);

// Rutas POST:
router.post("/db/providers/new", providers.createProvider);

// Rutas PUT:
router.put("/db/providers/update", providers.updateMedicineProvider);

router.put("/db/providers/add", providers.addMedicine);

// Rutas DELET
router.delete("/db/providers/:pharmacy", providers.deleteProvider);

module.exports = { router };