const WebSocket = require('ws');
const amqp = require('amqplib');
const { v4 } = require('uuid');
const logWithTimestamp = require('./logWithTimestamp');
const promClient = require('prom-client');
const { Counter } = require('prom-client');
const express = require('express');

// METRICS
const receivedMessagesCounter = new Counter({
    name: 'received_messages_total',
    help: 'Total number of received WebSocket messages'
});

const responseTimesHistogram = new promClient.Histogram({
    name: 'response_times_histogram',
    help: 'Histogram of response times',
    buckets: [0.1, 0.5, 1, 2, 5, 10]
});


// ENVIRONMENT VARIABLES
const WEBSERVER_PORT = 9091 || process.env.WEBSERVER_PORT;
const WEBSOCKET_PORT = 9001 || process.env.WEBSOCKET_PORT;
const RABBITMQ_SERVER = 'amqp://localhost' || process.env.RABBITMQ_SERVER;
const REQUEST_QUEUE = 'word_request_queue' || process.env.REQUEST_QUEUE;
const RESPONSE_QUEUE = 'word_response_queue' || process.env.RESPONSE_QUEUE;

// WEBSOCKET SERVER
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });

// RABBITMQ
async function connectToRabbitMQ() {
    const connection = await amqp.connect(RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(REQUEST_QUEUE);
    await channel.assertQueue(RESPONSE_QUEUE);
    return channel;
}

// RABBITMQ CONSUMER
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

// WEBSOCKET CONSUMER
wss.on('connection', (ws) => {
    const correlationId = v4();
    ws.correlationId = correlationId; // save correlationId on the WebSocket object
    ws.on('message', (message) => {
        const start = process.hrtime();
        receivedMessagesCounter.inc();
        const messageString = message.toString();
        logWithTimestamp(`Sending to queue: ${JSON.stringify({ message: messageString, correlationId })}`, '34');
        channel.sendToQueue(REQUEST_QUEUE, Buffer.from(message), { correlationId, replyTo: RESPONSE_QUEUE });
        const initialResponse = { message: 'RECEIVED', correlationId, requestedWord: messageString };
        logWithTimestamp(`Sending to client: ${JSON.stringify(initialResponse)}`, '33');
        ws.send(JSON.stringify(initialResponse));
        const elapsed = process.hrtime(start);
        const elapsedSeconds = elapsed[0] + elapsed[1] / 1e9;
        console.log('elapsedSeconds', elapsedSeconds);
        responseTimesHistogram.observe(elapsedSeconds);
    });
});

logWithTimestamp(`Websocket server started on port ${WEBSOCKET_PORT}`, '34');

const app = express();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

app.listen(WEBSERVER_PORT, () => {
    logWithTimestamp(`Prometheus metrics available at http://localhost:${WEBSERVER_PORT}/metrics`, '34');
    logWithTimestamp(`Webserver started on port ${WEBSERVER_PORT}`, '34');
});
