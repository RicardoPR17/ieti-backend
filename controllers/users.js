const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

client
  .connect()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

const database = client.db("FarmaYa");

const usersDoc = database.collection("Users");

/**
 * Función asíncrona para obtener todos los usuarios
 * @param {json} req solicitud HTTP
 * @param {json} res respuesta HTTP
 */
const getUsers = async (req, res) => {
  try {
    const result = await usersDoc.find({}).project({ _id: 0 }).toArray();
    res.status(200).json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

/**
 * Función asíncrona para obtener un usuario dado su documento
 * @param {json} req solicitud HTTP
 * @param {json} res respuesta HTTP
 */
const getAnUser = async (req, res) => {
  const docToSearch = req.params.document;
  try {
    if (!docToSearch) {
      res.status(400);
      throw new Error("Send a document number to search for the user.");
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

/**
 * Función asíncrona para crear un usuario
 * @param {json} req solicitud HTTP
 * @param {json} res respuesta HTTP
 */
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
      !("phone" in reqData) ||
      !("password" in reqData)
    ) {
      res.status(400);
      throw new Error("Invalid data to add the user");
    }

    const hashedPassword = await bcrypt.hash(reqData.password, 10);

    reqData.password = hashedPassword;

    const newAdded = await usersDoc.insertOne(reqData);

    res.status(201).json({ data: newAdded, message: "¡User created successfully!" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

/**
 * Función asíncrona para hacer el inicio de sesión de un usuario con su documento y contraseña
 * Si el inicio de sesión se realiza con éxito, el JSON de la respuesta contendrá el token jwt generado
 * @param {json} req solicitud HTTP
 * @param {json} res respuesta HTTP
 */
const loginUser = async (req, res) => {
  const { document, password } = req.body;

  try {
    if (!document || !password) {
      res.status(400);
      throw new Error("You must send Document and Password.");
    }

    const user = await usersDoc.findOne({ document: document });

    while(!user) {}


    if (!user) {
      res.status(404);
      throw new Error("User not found, authentication failed!");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401);
      throw new Error("Wrong password, authentication failed!");
    }

    const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.json({ error: err.message });
  }
};

/**
 * Función asíncrona para actualizar los datos de un usuario
 * @param {json} req solicitud HTTP
 * @param {json} res respuesta HTTP
 */
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
      while (!userFinal) {}
      res.status(200).send({ message: "User updated successfully" });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
};

/**
 * Función asíncrona para eliminar un usuario
 * @param {json} req solicitud HTTP
 * @param {json} res respuesta HTTP 
 */
const deleteUser = async (req, res) => {
  const reqData = req.params.id;
  try {
    const usertoDelete = await usersDoc.findOneAndDelete({ document: reqData });
    while (!usertoDelete) {}
    if (!usertoDelete) {
      res.status(404).send({ message: "User don't exist" });
    } else {
      res.status(204).send({ message: "User deleted successfully" });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
};
module.exports = { getUsers, getAnUser, addUser, loginUser, updateUser, deleteUser };
