const { MongoClient } = require("mongodb");
const moment = require("moment-timezone");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

client
  .connect()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

const database = client.db("FarmaYa");

const ordersDoc = database.collection("Orders");

/**
 * Función asíncrona que muestra todos los pedidos 
 * @param {Json} req Objeto que representa la solicitud http
 * @param {Json} res Objeto que representa la respuesta con la información solicitada
 */

const getAllOrders = async (req, res) => {
  try {
    const query = await ordersDoc.find().project({ _id: 0 }).sort({ order_id: 1 }).toArray();
    res.status(200).json(query);
  } catch (err) {
    res.json({ error: err.message });
  }
};

/**
 * Función asíncrona que permite crear una orden
 * @param {Json} req Objeto que representa la solicitud http
 * @param {Json} res Objeto que representa la respuesta con la información solicitada
 */
const createOrder = async (req, res) => {
  const reqData = req.body;
  try {
    if (
      reqData.length === 0 ||
      !("medicines" in reqData) ||
      !("doctor_name" in reqData) ||
      !("patient_name" in reqData) ||
      !("patient_document" in reqData)
    ) {
      res.status(400);
      throw new Error("Invalid data to create an order");
    }

    // Obtener la fecha y hora actual en la zona horaria de Bogotá
    const currentDateInBogota = moment.tz(new Date(), "America/Bogota");

    // Convertir a formato ISO con desfase UTC
    const actualDate = currentDateInBogota.toISOString();

    // Obtener el siguiente número para el ID de pedido
    const order_number = await ordersDoc.countDocuments() + 1; 

    while (!order_number) {}

    let order = {
      order_id: order_number.toString(),
      medicines: reqData.medicines,
      date: actualDate,
      domicile: reqData.domicile,
      address: reqData.address,
      provider: reqData.provider,
      doctor_name: reqData.doctor_name,
      patient_document: reqData.patient_document,
      patient_name: reqData.patient_name,
      delivered: false,
    };

    await ordersDoc.insertOne(order);

    res.status(201).send({ message: "Order created successfully!" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

/**
 * Función asíncrona que actualiza el estado de la orden como entregada
 * @param {Json} req Objeto que representa la solicitud http
 * @param {Json} res Objeto que representa la respuesta con la información solicitada
 */
const deliverOrder = async (req, res) => {
  const reqData = req.body;
  try {
    if (reqData.length === 0 || !("order_id" in reqData)) {
      res.status(400);
      throw new Error("Missing order identificator");
    }
    
    const updateResult = await ordersDoc.findOneAndUpdate({ order_id: reqData.order_id }, { $set: { delivered: true } });
    
    res.status(200).send({ message: "Order updated successfully!" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = { getAllOrders, createOrder, deliverOrder };
