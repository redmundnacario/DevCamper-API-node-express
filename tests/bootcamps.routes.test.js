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
            // since the application is already listening, it should use the allocated port
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
