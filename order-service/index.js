import { Kafka } from 'kafkajs'

const kafka = new Kafka({
    clientId: "order-service",
    brokers: ["localhost:9094"],
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: "order-service" });

const run = async () => {
    try {
        await producer.connect();
        await consumer.connect();
        await consumer.subscribe({
            topic: "payment-successful",
            fromBeginning: true
        });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value.toString()
                const { userId, orderId } = JSON.parse(value)

                //TODO: Create order on DB
                const dummyOrderId = "123456789"
                console.log(`Order consumer: Order create for user id: ${userId}`);

                await producer.send({
                    topic: "order-successful",
                    messages: [
                        { value: JSON.stringify({ userId, orderId: dummyOrderId }) }
                    ]
                });
            }
        })
    } catch (error) {
        console.log(error);
    }
}

run()