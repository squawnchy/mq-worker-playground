const amqp = require('amqplib');
const crypto = require('crypto');

const RABBITMQ_SERVER = 'amqp://localhost'; // RabbitMQ Server URL
const REQUEST_QUEUE = 'word_request_queue';
const RESPONSE_QUEUE = 'word_response_queue';

function calculatePOW(word) {
    let pow = 0;
    while (true) {
        const hash = crypto.createHash('sha256').update(JSON.stringify({ word, pow })).digest('hex');
        console.log(`pow: ${pow}, hash: ${hash}`);
        if (hash.startsWith('0000')) {
            return pow;
        }
        pow++;
    }
}

async function startWorker() {
    console.log('starting worker...');
    const connection = await amqp.connect(RABBITMQ_SERVER);
    console.log('connected to RabbitMQ server');
    const channel = await connection.createChannel();
    channel.prefetch(1);
    console.log('created channel');
    await channel.assertQueue(REQUEST_QUEUE);
    await channel.assertQueue(RESPONSE_QUEUE);

    console.log('listening for messages...');
    channel.consume(REQUEST_QUEUE, (msg) => {
        const word = msg.content.toString();
        console.log('received from queue: %s', { word, correlationId: msg.properties.correlationId });
        console.log('calculating POW...');
        const pow = calculatePOW(word);

        console.log('sending to queue: %s', { word, pow, correlationId: msg.properties.correlationId });
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({ word, pow })), { correlationId: msg.properties.correlationId });
        channel.ack(msg);
    });
}

startWorker().catch(console.error);
