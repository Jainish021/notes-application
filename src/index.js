const express = require("express")
const cors = require("cors")
const path = require('path')
const mongoose = require("./db/mongoose")
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT

if (process.env.NODE_ENV !== "production") {
    app.use(cors())
}
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../client/build")))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client/build/index.html"))
    })
}

app.listen(port, () => {
    console.log("Server is up and running on port: " + port)
})
