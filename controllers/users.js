const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const { json } = require("express");
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

const updateUser = async (req, res) => {
  const reqData = req.body;
  try {
    if (
      reqData.length === 0 ||
      !("document" in reqData) ||
      !("eps" in reqData) ||
      !("address" in reqData) ||
      !("city" in reqData) ||
      !("phone" in reqData)
    ) {
      res.status(400);
      throw new Error("Invalid user data");
    }
    const validateUser = await usersDoc.find({ document: reqData.document }).toArray();
    if (validateUser.length === 0) {
      res.status(404);
      throw new Error("User don't found");
    } else {
      const updateData = {
        eps: reqData.eps,
        address: reqData.address,
        city: reqData.city,
        phone: reqData.phone,
      };
      const userFinal = await usersDoc.findOneAndUpdate({ document: reqData.document }, { $set: updateData });
      while (!userFinal) {
      }
      res.status(200).send({ message: "User updated successfully" });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
};

const deleteUser = async (req, res) => {
  const reqData = req.params.id;
  try {
    const usertoDelete = await usersDoc.findOneAndDelete({ document: reqData });
    while (!usertoDelete) { }
    if (!usertoDelete) {
      res.status(404).send({ message: "User don't exist" });
    } else {
      res.status(204).send({ message: "User deleted successfully" });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
}
module.exports = { getUsers, getAnUser, addUser, updateUser, deleteUser };
