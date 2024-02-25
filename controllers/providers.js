const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

client
    .connect()
    .then(() => console.log("Connected"))
    .catch((err) => console.log(err));

const database = client.db("FarmaYa");

const providers = database.collection("Providers");

// The user must be able to see ALL the providers on the platform.
const getAllProviders = async (req, res) => {
    try {
        const query = await providers.find().project({ _id: 0 }).toArray();
        res.status(200).json(query);
    } catch (err) {
        res.json({ error: err.message });
    }
};

// Create Provider
const createProvider = async (req, res) => {
    const reqData = req.body;
    try {
        if (
            reqData.length === 0 ||
            !("medicines" in reqData) ||
            !("pharmacy" in reqData)
        ) {
            res.status(400);
            throw new Error("Invalid data to create provider");
        }

        const name = new RegExp(`${reqData.pharmacy}`, 'i');
        const providers_name = await providers.find({ pharmacy: name }).toArray();
        while (!providers_name) { }

        if (providers_name.length === 0) {
            let pharmacy = {
                medicines: reqData.medicines,
                pharmacy: reqData.pharmacy
            };

            const new_provider = await providers.insertOne(pharmacy);
            while (!new_provider) { }

            res.status(201).send({ message: "Provider created successfully!" });
        } else {
            res.status(403).send({ message: "Provider already exists!" });
        }
    } catch (err) {
        res.json({ error: err.message });
    }
};

const getProvider = async (req, res) => {
    try {
        const reqData = req.params.namePharmacy;
        const pharmacy = new RegExp(`${reqData}`, 'i');
        const query = await providers.find({ pharmacy: pharmacy }).project({ _id: 0 }).toArray();

        if (query.length === 0) {
            res.status(404);
            throw new Error("Pharmacy not found");
        }

        res.status(200).json(query);
    } catch (err) {
        res.json({ error: err.message });
    }
};


const getMedicineProvider = async (req, res) => {
    try {
        const reqData = req.params.medicine;
        const medicine = new RegExp(`${reqData}`, 'i');
        const query = await providers.find({ 'medicines.medicine_name': medicine }).project({ _id: 0, pharmacy: 1, 'medicines.$': 1 }).toArray();

        if (query.length === 0) {
            res.status(404);
            throw new Error("Medicine not found");
        }

        res.status(200).json(query);
    } catch (err) {
        res.json({ error: err.message });
    }
};

const updateMedicineProvider = async (req, res) => {
    const reqData = req.body;
    try {
        if (
            reqData.length === 0 ||
            !("pharmacy" in reqData) ||
            !("medicine_name" in reqData) ||
            !("laboratory" in reqData) ||
            !("price" in reqData) ||
            !("stock" in reqData)
        ) {
            res.status(400);
            throw new Error("Invalid data to update medicine information");
        } else {
            const pharmacy = new RegExp(`${reqData.pharmacy}`, 'i');
            const medicine = new RegExp(`${reqData.medicine_name}`, 'i');

            const provider_validation = await providers.find({ pharmacy: pharmacy, "medicines.medicine_name": medicine }).toArray();
            if (provider_validation.length === 0) {
                res.status(404).send({ message: "Pharmacy or medicine doesn´t exists!" });
            } else {
                const updateFields = { "medicines.$.laboratory": reqData.laboratory, "medicines.$.price": reqData.price, "medicines.$.stock": reqData.stock };
                const update = await providers.findOneAndUpdate({ pharmacy: pharmacy, "medicines.medicine_name": medicine }, { $set: updateFields });
                while (!update) { }
                res.status(200).send({ message: "Medicine updated successfully!" });
            }
        }
    } catch (error) {
        res.json({ error: error.message });
    }
};

const addMedicine = async (req, res) => {
    const reqData = req.body;
    try {
        if (
            reqData.length === 0 ||
            !("pharmacy" in reqData) ||
            !("medicine_name" in reqData) ||
            !("description" in reqData) ||
            !("laboratory" in reqData) ||
            !("price" in reqData) ||
            !("stock" in reqData)
        ) {
            res.status(400);
            throw new Error("Invalid data to add new medicine");
        } else {
            const pharmacy = new RegExp(`${reqData.pharmacy}`, 'i');
            const medicine = new RegExp(`${reqData.medicine_name}`, 'i');

            const provider_validation = await providers.find({ pharmacy: pharmacy, "medicines.medicine_name": medicine }).toArray();
            if (provider_validation.length !== 0) {
                res.status(403).send({ message: "Medicine already exists!" });
            } else {
                const new_medicine = { medicine_name: reqData.medicine_name, description: reqData.description, laboratory: reqData.laboratory, price: reqData.price, stock: reqData.stock };
                const pharmacy_medicines = await providers.find({ pharmacy: pharmacy }).toArray();
                const new_medicines = pharmacy_medicines[0].medicines;
                new_medicines.push(new_medicine);
                const update_medicines = await providers.findOneAndUpdate({ pharmacy: pharmacy }, { $set: { medicines: new_medicines } });
                while (!update_medicines) { }
                res.status(200).send({ message: "Medicine added successfully!" });
            }
        }
    } catch (error) {
        res.json({ error: error.message });
    }
};

const deleteProvider = async (req, res) => {
    const reqData = req.params.pharmacy;
    try {
        const pharmacy = new RegExp(`${reqData}`, 'i');
        const delete_provider = await providers.findOneAndDelete({ pharmacy: pharmacy });
        while (!delete_provider) { }
        if (!delete_provider) {
            res.status(404).send({ message: "Provider doesn´t exists." });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.json({ error: error.message });
    }
};

module.exports = { getAllProviders, createProvider, getProvider, getMedicineProvider, updateMedicineProvider, addMedicine, deleteProvider };
