const request = require("supertest")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const app = require("../task-manager-server/src/app")
const User = require("../task-manager-server/src/models/user")
const { userOne, userOneId, setupDatabase } = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should signup user", async () => {
    const response = await request(app).post("/users").send({
        name: "Jainish",
        email: "jainish@example.com",
        password: "abcd@123",
        age: 23
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: "Jainish",
            email: "jainish@example.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe("abcd@123")
})

test("Should login existing user", async () => {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)

    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not login non existent user", async () => {
    await request(app).post("/users/login").send({
        email: "qwerty@example.com",
        password: "xyz@3421"
    }).expect(400)
})

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not get profile for unauthenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
})

test("Should delete profile for user", async () => {
    const response = await request(app)
        .delete("/users/me")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test("Should not delete profile for unauthenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/portrait.jpg")
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user field", async () => {
    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({ "name": "Adesara" })
        .expect(201)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual("Adesara")
})

test("Should not update invalid user field", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({ "location": "Dallas" })
        .expect(400)
})