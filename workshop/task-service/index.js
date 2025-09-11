import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

const app = express()
const port = 3002

// db connect
// mongoose.connect("mongodb://localhost:27017/users").then(() => {
//     console.log("Connected to MongoDB...");
// }).catch(err => console.log(`Connection MongoDB Error: ${err}`));

mongoose.connect("mongodb://mongodb:27017/users").then(() => {
    console.log("Connected to MongoDB...");
}).catch(err => console.log(`Connection MongoDB Error: ${err}`));

// Schema
const TaskSchema = new mongoose.Schema({
    title: String,
    desc: String,
    userId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Task = mongoose.model("Task", TaskSchema);

// middleware
app.use(bodyParser.json())

app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();

    res.status(200).json(tasks)
})

app.post("/tasks", async (req, res) => {
    try {
        const { title, desc, userId } = req.body
        const task = new Task({ title, desc, userId })

        await task.save(task);

        res.status(201).json({
            message: "create task successful",
            task: task
        });
    } catch (error) {
        console.log(`Error ${error}`);
        res.status(500).json({
            error: `Internal Server error: ${error}`
        })
    }
})

app.get('/', (req, res) => {
    res.send('task-service')
})

app.listen(port, () => {
    console.log(`app listening on port: ${port}`)
})

