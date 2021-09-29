const request = require("supertest");
const app = require("../server");
const connectDB = require("../config/db");

// const colors = require
describe("Sample test", () => {
    let server, agent;
    let PORT = 4000;
    let conn;
    beforeAll(async () => {
        conn = await connectDB();

        server = app.listen(PORT, (err) => {
            console.log(
                `Server running in ${[
                    process.env.NODE_ENV,
                ]} mode with port ${PORT}`.yellow.bold
            );
        });
    });

    it("should show all bootcamps", async () => {
        const res = await request.agent(server).get("/api/v1/bootcamps");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("success");
    });

    it("should NOT show all bootcamp", async () => {
        const res = await request.agent(server).get("/api/v1/bootcamps/1");
        expect(res.statusCode).toEqual(404);
        expect(res.body.success).toBe(false);
    });

    it("should get 2 bootcamps within boston area", async () => {
        const res = await request
            .agent(server)
            .get("/api/v1/bootcamps/radius/02118/30");
        expect(res.statusCode).toEqual(200);
        expect(res.body.count).toEqual(2);
    });

    it("should filter bootcamps with queried averageCost less than 1000", async () => {
        const res = await request
            .agent(server)
            .get("/api/v1/bootcamps?averageCost[lte]=1000");
        expect(res.statusCode).toEqual(200);
        expect(res.body.count).toEqual(3);
    });

    it("should return bootcamps with specific fields", async () => {
        const res = await request
            .agent(server)
            .get("/api/v1/bootcamps?select=name,averageCost");
        expect(res.statusCode).toEqual(200);
        expect(
            Object.keys(res.body.data[0]).includes("description")
        ).toBeFalsy();
    });

    it("should return bootcamps sorted ascending in averageCost", async () => {
        const res = await request
            .agent(server)
            .get("/api/v1/bootcamps?sort=averageCost");
        expect(res.statusCode).toEqual(200);
        expect(res.body.data[0].averageCost).toBe(500);
        expect(res.body.data[3].averageCost).toBe(1200);
    });

    it("should has prev page in pagination", async () => {
        const res = await request
            .agent(server)
            .get("/api/v1/bootcamps?select=name&limit=1&page=4");
        expect(res.statusCode).toEqual(200);
        expect(res.body.pagination.prev).toMatchObject({
            page: 3,
            limit: 1,
        });
    });

    afterAll(async () => {
        server.close();
        conn.disconnect();
    });
});

// describe('Post Endpoints', () => {
//   it('should create a new post', async () => {
//     const res = await request(app)
//       .post('/api/posts')
//       .send({
//         userId: 1,
//         title: 'test is cool',
//       })
//     expect(res.statusCode).toEqual(201)
//     expect(res.body).toHaveProperty('post')
//   })
// })
