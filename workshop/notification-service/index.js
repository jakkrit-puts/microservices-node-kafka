import amqp from "amqplib";

async function start() {
    try {
        let connection = await amqp.connect("amqp://rabbitmq");
        let channel = await connection.createChannel();

        await channel.assertQueue("task_created");
        console.log("NOtification Service to message");

        channel.consume("task_created", (msg) => {
            const taskData = JSON.parse(msg.content.toString());
            console.log("Notifcation: NEW TASK:", taskData.title);
            console.log("Notifcation: NEW TASK:", taskData);
            channel.ack(msg)
        });

    } catch (error) {
        console.log(`RabbitMQ Connection Error: ${error}`);
    }
}

start();