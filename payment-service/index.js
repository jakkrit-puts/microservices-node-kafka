import express from 'express'
import cors from 'cors'
import { Kafka } from 'kafkajs'

const app = express()

// Middlewares
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000"
}))

const kafka = new Kafka({
    cliendId: "payment-service",
    brokers: ["localhost:9094"]
})

const producer = kafka.producer()

const connectToKafka = async () => {
    try {
        await producer.connect()
        console.log("Producer connected!");
    } catch (error) {
        console.log("Error connecting to Kafka", error);
    }
}

app.post("/payment-service", async (req, res) => {
    const { cart } = req.body

    // get cookie and decrypt data user
    const userId = "123"

    // TODO: Payment
    // console.log("API Hit..");


    // Kafka
    await producer.send({
        topic: "payment-successful",
        messages: [{ value: JSON.stringify({ userId, cart }) }]
    });
    return res.status(200).send("Payment Process Successfully.");
})

// Run App
app.listen(8000, () => {
    connectToKafka();
    console.log("Payment Service is runing on port: 8000");
})