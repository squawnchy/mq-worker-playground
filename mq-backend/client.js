const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9001');
const logWithTimestamp = require('./logWithTimestamp');

ws.on('open', function open() {
    const word = process.argv[2];
    logWithTimestamp(`Sending: ${word}`, '34'); // blue for sent messages
    ws.send(word);
});

ws.on('message', function incoming(data) {
    const response = JSON.parse(data);

    const isReceived = response.message === 'RECEIVED';
    const isFinished = response.message === 'FINISHED';

    if (isReceived) {
        logWithTimestamp(`Received acknowledgement: ${JSON.stringify(response)}`, '33'); // yellow for received messages
        return;
    }

    if (isFinished) {
        logWithTimestamp(`Processing finished: ${JSON.stringify(response)}`, '32'); // green for finished messages
        process.exit(0);
    }

    logWithTimestamp(`Unexpected message received: ${data}`, '31'); // red for unexpected messages
    process.exit(1);
});
