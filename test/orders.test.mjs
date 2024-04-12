import { expect } from "chai";

import { getAllOrders, createOrder, deliverOrder } from "../controllers/orders.js";


describe("GET all orders", () => {
    it("it should GET all the orders", async (done) => {
        const orders = await getAllOrders().then(done());
        expect(orders[0]).to.be.a("json");
        expect(orders).to.have.status(200);
    });
});

describe("Create a new order", () => {
    it("it should POST a new order", async (done) => {
        // valid data
        const req = {
            body: {"medicines": [
                {
                    "medicine_name": "Advil",
                    "amount": "5",
                    "authorization_required": "false"
                }
            ],
            "domicile": true,
            "address": "Cll 90 #5a - 14",
            "provider": "Cruz Verde",
            "doctor_name": "Carlos",
            "patient_document": "12346",
            "patient_name": "Maria"
        }
    }
        

        const order = await createOrder(req).then(done());
        expect(order).to.have.status(201);
        expect(order).to.be.a("json");
        expect(order).to.have.property('message').eq("Order created successfully!");
    
    });

    it("it should send an error for incomplete data", async (done) => {
        // invalid data
        const req = {
            body: {
            "domicile": true,
            "address": "Cll 90 #5a - 14",
            "provider": "Cruz Verde",
            "doctor_name": "Carlos",
            "patient_document": "12346",
            "patient_name": "Maria"
        }
        }

        const order = await createOrder(req).then(done());
        expect(order).to.have.status(400);
        expect(order).to.be.a("json");
        expect(order).to.have.property('message').eq("Invalid data to create an order");
    });
});

describe("Deliver order", () => {
    it("it should update a order", async (done) => {
        const req = {
            body: {
                order_id:2
            }
        }


        const order = await deliverOrder(req).then(done());
        expect(order).to.have.status(200);
        expect(order).to.be.a("json");
        expect(order).to.have.property('message').eq("Order updated successfully");
    });
});