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
        const providers_name = await providers.find({ pharmacy : name }).toArray();
        while (!providers_name) { }

        if (providers_name.length == 0) {
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



module.exports = { getAllProviders, createProvider, getProvider, getMedicineProvider };
