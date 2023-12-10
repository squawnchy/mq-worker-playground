const amqp = require('amqplib');
const crypto = require('crypto');
const logWithTimestamp = require('./logWithTimestamp');

const RABBITMQ_SERVER = 'amqp://localhost'; // RabbitMQ Server URL
const REQUEST_QUEUE = 'word_request_queue';
const RESPONSE_QUEUE = 'word_response_queue';

function calculatePOW(word) {
    let pow = 0;
    while (true) {
        const hash = crypto.createHash('sha256').update(JSON.stringify({ word, pow })).digest('hex');
        const isPOW = hash.startsWith('0000');
        if (isPOW) {
            logWithTimestamp(`Found POW: ${pow}, hash: ${hash}`, '32'); // green for matching POW
            return pow;
        }
        logWithTimestamp(`Calculated POW: ${pow}, hash: ${hash}`, '33'); // yellow for calculated POW
        pow++;
    }
}

async function startWorker() {
    logWithTimestamp('starting worker...', '34');
    const connection = await amqp.connect(RABBITMQ_SERVER);
    logWithTimestamp('connected to RabbitMQ server', '34');
    const channel = await connection.createChannel();
    channel.prefetch(1);

    await channel.assertQueue(REQUEST_QUEUE);
    await channel.assertQueue(RESPONSE_QUEUE);

    logWithTimestamp('waiting for messages...', '34');
    channel.consume(REQUEST_QUEUE, (msg) => {
        const word = msg.content.toString();
        const pow = calculatePOW(word);

        logWithTimestamp(`sending to queue: ${JSON.stringify({ word, pow, correlationId: msg.properties.correlationId })}`, '34');
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({ word, pow })), { correlationId: msg.properties.correlationId });
        channel.ack(msg);
    });
}

startWorker().catch(console.error);
