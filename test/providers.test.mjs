import { expect } from "chai";

import { getAllProviders, getProvider, getMedicineProvider, createProvider, updateMedicineProvider, addMedicine, deleteProvider, deleteMedicine } from "../controllers/providers.js";


describe("GET all providers", () => {
    it("it should GET all the providers", async (done) => {
        const provider = await getAllProviders().then(done());
        expect(provider[0]).to.have.length.least(1);
        expect(provider[0]).to.be.a("json");
        expect(provider).to.have.status(200);
    });
});

describe("Get a provider by his name", () => {
    it("it should GET a provider by the given name", async (done) => {
        const name = "Cruz Verde";
        const req = {
            params: {
                pharmacy: name
            }
        };

        const provider = await getProvider(req).then(done());
        expect(provider[0]).to.be.a("json");
        expect(provider[0]).to.have.property('pharmacy').eq(doc);
        expect(provider[0]).to.have.property('medicine_name');
        expect(provider[0]).to.have.property('laboratory');
        expect(provider[0]).to.have.property('price');
        expect(provider[0]).to.have.property('stock');
    });
});

describe("Get a provider by medicine name", () => {
    it("it should GET a provider by the given medicine name", async (done) => {
        const medicineName = "Aspirin";
        const req = {
            params: {
                medicine: medicineName
            }
        };

        const provider = await getMedicineProvider(req).then(done());
        expect(provider[0]).to.be.a("json");
        expect(provider[0]).to.have.property('pharmacy');
        expect(provider[0]).to.have.property('medicines').that.is.an('array');
        expect(provider[0].medicines[0]).to.have.property('medicine_name').eq(medicineName);
    });
});

describe("Create a provider", () => {
    it("it should POST a new provider", async (done) => {
        const req = {
            body: {
                medicines: [{ medicine_name: "Dolex", description: "", price: 2000, stock: 500, laboratory: "MK" }],
                pharmacy: "La Rebaja"
            }
        };

        const provider = await createProvider(req).then(done());
        expect(provider).to.have.status(201);
        expect(provider).to.have.property('message').eq("Provider created successfully!");
    });
});

describe("Update a medicine of a provider", () => {
    it("it should PUT updated data for a medicine", async (done) => {
        const req = {
            body: {
                pharmacy: "La Rebaja",
                medicine_name: "Dolex",
                laboratory: "MK",
                price: 2000,
                stock: 250
            }
        };

        const provider = await updateMedicineProvider(req).then(done());
        expect(provider).to.have.status(200);
        expect(provider).to.have.property('message').eq("Medicine updated successfully!");
    });
});

describe("Add a medicine to a provider", () => {
    it("it should POST a new medicine to a provider", async (done) => {
        const req = {
            body: {
                pharmacy: "La Rebaja",
                medicine_name: "Aspirin",
                description: "",
                laboratory: "Bayer",
                price: 2500,
                stock: 100
            }
        };

        const provider = await addMedicine(req).then(done());
        expect(provider).to.have.status(200);
        expect(provider).to.have.property('message').eq("Medicine added successfully!");
    });
});

describe("Delete a medicine from a provider", () => {
    it("it should DELETE a medicine from a provider", async (done) => {
        const req = {
            params: {
                pharmacy: "La Rebaja",
                medicine: "Aspirin"
            }
        };

        const provider = await deleteMedicine(req).then(done());
        expect(provider).to.have.status(204);
        expect(provider).to.have.property('message').eq("Medicine deleted successfully.");
    });
});

describe("Delete a provider", () => {
    it("it should DELETE a provider", async (done) => {
        const req = {
            params: {
                pharmacy: "La Rebaja"
            }
        };

        const provider = await deleteProvider(req).then(done());
        expect(provider).to.have.status(204);
        expect(provider).to.have.property('message').eq("Provider deleted successfully.");
    });
});


