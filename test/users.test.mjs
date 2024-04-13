import { expect } from "chai";

import { getUsers, getAnUser, addUser, updateUser, deleteUser } from "../controllers/users.js";


describe("GET all users", () => {
    it("it should GET all the users", async (done) => {
        const user = await getUsers().then(done());
        expect(user[0]).to.have.length.least(1);
        expect(user[0]).to.be.a("json");
        expect(user).to.have.status(200);
    });
});

describe("Get a user by his document", () => {
    it("it should GET a user by the given document", async (done) => {
        const doc = "1000649279";
        const req = {
            params: {
                document: doc
            }
        };

        const user = await getAnUser(req).then(done());
        expect(user[0]).to.be.a("json");
        expect(user[0]).to.have.property('document').eq(doc);
        expect(user[0]).to.have.property('name');
        expect(user[0]).to.have.property('address');
        expect(user[0]).to.have.property('city');
        expect(user[0]).to.have.property('phone');
        expect(user[0]).to.have.property('eps');
    });
});

describe("Add a new user", () => {
    it("it should POST a new user", async (done) => {
        // valid data
        const req = {
            body: {
                name: "Pepe",
                document: "1000456987",
                address: "calle 128",
                city: "bogota",
                phone: "2013478767",
                eps: "Nueva eps"
            }
        }

        const user = await addUser(req).then(done());
        expect(user).to.have.status(201);
        expect(user).to.be.a("json");
        expect(user).to.have.property('message').eq("¡User created successfully!");
    
    });

    it("it should send an error for incomplete data", async (done) => {
        // invalid data
        const req = {
            body: {
                name: "Pepe",
                document: "1000456987",
                address: "calle 128"
            }
        }

        const user = await addUser(req).then(done());
        expect(user).to.have.status(400);
        expect(user).to.be.a("json");
        expect(user).to.have.property('message').eq("Invalid data to add the user");
    });
});

describe("Update a user", () => {
    it("it should update a user", async (done) => {
        const req = {
            body: {
                name: "Pepe",
                document: "1000456987",
                address: "calle 128",
                city: "bogota",
                phone: "2013478767",
                eps: "Servisalud"
            }
        }

        const user = await updateUser(req).then(done());
        expect(user).to.have.status(200);
        expect(user).to.be.a("json");
        expect(user).to.have.property('message').eq("User updated successfully");
    });
});

describe("Delete a user", () => {
    it("it should delete a user", async (done) => {
        const req = {
            params: {
                id: "1000456987"
            }
        }

        const user = await deleteUser(req).then(done());
        expect(user).to.have.status(204);
        expect(user).to.be.a("json");
        expect(user).to.have.property('message').eq("User deleted successfully");
    });
});