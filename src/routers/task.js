const express = require("express")
const Task = require("../models/task")
const User = require("../models/user")
const auth = require("../middleware/auth")
const router = new express.Router()

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user.id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send({ error: "Unable to create a new task!" })
    }
})

router.get("/tasks", auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    }

    try {
        await req.user.populate([{
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }, {
            path: 'totalTasks',
            match
        }])
        res.status(201).send({ tasks: req.user.tasks, totalTasks: req.user.totalTasks })
    } catch (e) {
        res.status(500).send({ error: "Unable to fetch the tasks!" })
    }
})

router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({ id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send("No task found")
        }
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send({ error: "Unable to fetch the task!" })
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(201).send(task)
    } catch (e) {
        res.status(400).send({ error: "Unable to update! Try again later." })
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send({ error: "Task not found!" })
        }
        res.send(task)
    } catch (e) {
        res.status(500).send({ error: "Unable to delete the task! Try again later." })
    }
})

module.exports = router