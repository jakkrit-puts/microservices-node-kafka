import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import amqp from "amqplib";

const app = express()
const port = 3002

// db connect
// mongoose.connect("mongodb://localhost:27017/tasks").then(() => {
//     console.log("Connected to MongoDB...");
// }).catch(err => console.log(`Connection MongoDB Error: ${err}`));

mongoose.connect("mongodb://mongodb:27017/tasks").then(() => {
    console.log("Connected to MongoDB...");
}).catch(err => console.log(`Connection MongoDB Error: ${err}`));

// middleware
app.use(bodyParser.json())

// Schema
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

let channel, connection;

async function connectRabbitMQWithRetry(retries = 5, delay = 3000) {
    while (retries) {
        try {
            connection = await amqp.connect("amqp://rabbitmq");
            channel = await connection.createChannel();
            await channel.assertQueue("task_created");

            console.log("Connected to RabbitMQ");

            return;
        } catch (error) {
            console.log(`RabbitMQ Connection Error: ${error}`);
            retries--;
            console.log(`RabbitMQ Connection Error: ${retries}`);
        }
    }
}

app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();

    res.status(200).json(tasks)
})

app.post("/tasks", async (req, res) => {
    try {
        const { title, desc, userId } = req.body
        const task = new Task({ title, desc, userId })

        await task.save(task);

   
        
        const message = { taskId: task._id, userId, title }

        if (!channel) {
            return res.status(503).json({ error: "RabbitMQ not connected !!!" })
        }

        channel.sendToQueue("task_created", Buffer.from(
            JSON.stringify(message)
        ))

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
    connectRabbitMQWithRetry()

})

