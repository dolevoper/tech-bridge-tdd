import { describe, test, expect, jest } from "@jest/globals";
import supertest from "supertest";
import { app } from "./app";

describe("Social Network", () => {
    test("Alice can post messages to a personal timeline", async () => {
        await supertest(app)
            .post("/timeline/alice")
            .auth("alice", "1234")
            .send({
                content: "hello world"
            })
            .expect(200);

        const actual = await supertest(app)
            .get("/timeline/alice")
            .auth("alice", "1234")
            .expect(200)
            .expect("Content-Type", /json/);

        expect(actual.body).toEqual(expect.arrayContaining([{
            content: "hello world",
            createdAt: expect.stringContaining("")
        }]));
    });

    test("Bob can post messages to a personal timeline", async () => {
        await supertest(app)
            .post("/timeline/bob")
            .auth("bob", "1234")
            .send({
                content: "this is bob"
            })
            .expect(200);

        const actual = await supertest(app)
            .get("/timeline/bob")
            .auth("bob", "1234")
            .expect(200)
            .expect("Content-Type", /json/);

        expect(actual.body).toEqual(expect.arrayContaining([{
            content: "this is bob",
            createdAt: expect.stringContaining("")
        }]));
    });

    test("Bob cannot post to Alice's timeline", async () => {
        await supertest(app)
            .post("/timeline/alice")
            .auth("bob", "1234")
            .send({
                content: "you've been hacked!"
            })
            .expect(403);
    });

    test("Bob can view Alice's timeline", async () => {
        await supertest(app)
            .post("/timeline/alice")
            .auth("alice", "1234")
            .send({
                content: "this message is for bob"
            })
            .expect(200);

        const actual = await supertest(app)
            .get("/timeline/alice")
            .auth("bob", "1234")
            .expect(200)
            .expect("Content-Type", /json/);

        expect(actual.body).toEqual(expect.arrayContaining([{
            content: "this message is for bob",
            createdAt: expect.stringContaining("")
        }]));
    });
});