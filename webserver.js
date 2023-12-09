const WebSocket = require('ws');
const amqp = require('amqplib');
const logWithTimestamp = require('./logWithTimestamp');

const wss = new WebSocket.Server({ port: 9001 });
const RABBITMQ_SERVER = 'amqp://localhost';
const REQUEST_QUEUE = 'word_request_queue';
const RESPONSE_QUEUE = 'word_response_queue';

async function connectToRabbitMQ() {
    const connection = await amqp.connect(RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(REQUEST_QUEUE);
    await channel.assertQueue(RESPONSE_QUEUE);
    return channel;
}

let channel;

connectToRabbitMQ().then(ch => {
    channel = ch;

    channel.consume(RESPONSE_QUEUE, (msg) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client.correlationId === msg.properties.correlationId) {
                const responseFromQueue = JSON.parse(msg.content.toString());
                const responseForClient = { message: 'FINISHED', correlationId: msg.properties.correlationId, ...responseFromQueue };
                logWithTimestamp(`Sending to client: ${JSON.stringify(responseForClient)}`, '32');
                client.send(JSON.stringify(responseForClient));
                channel.ack(msg);
            }
        });
    }, { noAck: false });
});

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const messageString = message.toString();
        const correlationId = (Math.random() * 1000000000000).toString();
        ws.correlationId = correlationId; // save correlationId on the WebSocket object
        logWithTimestamp(`Sending to queue: ${JSON.stringify({ message: messageString, correlationId })}`, '34');
        channel.sendToQueue(REQUEST_QUEUE, Buffer.from(message), { correlationId, replyTo: RESPONSE_QUEUE });
        const initialResponse = { message: 'RECEIVED', correlationId, requestedWord: messageString };
        ws.send(JSON.stringify(initialResponse));
    });
});

console.log('WebSocket server started on ws://localhost:9001');
