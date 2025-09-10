import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    cliendId: "kafka-service",
    brokers: ["localhost:9094"]
})

const admin = kafka.admin()

const run = async () => {
    await admin.connect()
    await admin.createTopics({
        topics: [
            { topic: "payment-succesful" },
            { topic: "order-succesful" }
        ]
    })
}

run()