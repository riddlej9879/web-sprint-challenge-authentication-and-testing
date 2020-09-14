const request = require("supertest");
const server = require("./server");
const db = require("../database/dbConfig");
const supertest = require("supertest");

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("/api/auth", () => {
  describe("POST /register", () => {
    it("creates a new user", async () => {
      const res = await supertest(server).post("/api/auth/register").send({
        username: "user4",
        password: "pass4",
      });
      expect(res.statusCode).toBe(201);
      expect(res.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
    });
    it("rejects a registration using an existing username", async () => {
      const res = await supertest(server).post("/api/auth/register").send({
        username: "TestUser",
        password: "TestPass",
      });
      expect(res.statusCode).toBe(409);
      expect(res.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(res.body.message).toBe("Please pick a unique username");
    });
  });

  describe("POST /login", () => {
    it("returns a json web token on a successful login", async () => {
      const res = await supertest(server).post("/api/auth/login").send({
        username: "TestUser",
        password: "TestPass",
      });
      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(res.body.message).toBe("Welcome TestUser!");
      expect(res.body.token).toBeDefined();
    });
    it("rejects an incorrect password", async () => {
      const res = await supertest(server).post("/api/auth/login").send({
        username: "TestUser",
        password: "WrongPassword",
      });
      expect(res.statusCode).toBe(401);
      expect(res.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(res.body.message).toBe("Username or password invalid");
    });
    it("rejects a nonexistant username", async () => {
      const res = await supertest(server).post("/api/auth/login").send({
        username: "wrongUsername",
        password: "TestPass",
      });
      expect(res.statusCode).toBe(401);
      expect(res.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(res.body.message).toBe("Username or password invalid");
    });
  });
});

describe("/api/jokes", () => {
  describe("GET /", () => {
    it("returns a dad joke to a logged in user", async () => {
      const login_res = await supertest(server).post("/api/auth/login").send({
        username: "TestUser",
        password: "TestPass",
      });
      const res = await supertest(server).get("/api/jokes").send({
        token: login_res.body.token,
      });
      console.log(login_res.body.token);
      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
    });
    it("denies access to unauthenticated users", async () => {
      const res = await supertest(server).get("/api/jokes");
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Shall not pass!");
    });
    it("denies access to an incorrect web token", async () => {
      const res = await supertest(server).get("/api/jokes").send({
        token: "wrong",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Shall not pass!");
    });
  });
});
