const request = require("supertest")
const Task = require("../src/models/task")
const app = require("../src/app")
const { userOne, userOneId, userTwo, userTwoId, setupDatabase, taskOne } = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "Test task"
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test("Should get all the tasks for user", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(201)

    expect(response.body.length).toBe(2)
})

test("Should not delete other users task", async () => {
    const response = await request(app)
        .delete("/tasks/" + taskOne._id)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})