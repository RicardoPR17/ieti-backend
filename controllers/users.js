const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

client
  .connect()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

const database = client.db("FarmaYa");

const usersDoc = database.collection("Users");

const getUsers = async (req, res) => {
  try {
    const result = await usersDoc.find({}).project({ _id: 0 }).toArray();
    res.status(200).json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

const getAnUser = async (req, res) => {
  const docToSearch = req.params.document;
  try {
    if (!docToSearch) {
      res.status(400);
      throw new Error("Send a document number to search for the user."); // email¿? tipoDoc ¿? ¿phone?
    }

    const user = await usersDoc.find({ document: docToSearch }).project({ _id: 0 }).toArray();

    if (user.length === 0) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
};

const addUser = async (req, res) => {
  try {
    const reqData = req.body;

    if (
      reqData.length === 0 ||
      !("document" in reqData) ||
      !("name" in reqData) ||
      !("eps" in reqData) ||
      !("address" in reqData) ||
      !("city" in reqData) ||
      !("phone" in reqData)
    ) {
      res.status(400);
      throw new Error("Invalid data to add the user");
    }

    const newAdded = await usersDoc.insertOne(reqData);

    res.status(201).json({ data: newAdded, message: "¡User created successfully!" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = { getUsers, getAnUser, addUser };
