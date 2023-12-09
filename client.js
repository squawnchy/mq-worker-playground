const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9001');

function logWithTimestamp(message, colorCode = '') {
    const timestamp = new Date().toISOString();
    if (colorCode) {
        console.log(`\x1b[${colorCode}m[${timestamp}] ${message}\x1b[0m`);
    } else {
        console.log(`[${timestamp}] ${message}`);
    }
}

ws.on('open', function open() {
    const word = process.argv[2];
    logWithTimestamp(`Sending: ${word}`, '34'); // Blau für sendende Nachrichten
    ws.send(word);
});

ws.on('message', function incoming(data) {
    const response = JSON.parse(data);

    const isReceived = response.message === 'RECEIVED';
    const isFinished = response.message === 'FINISHED';

    if (isReceived) {
        logWithTimestamp(`Received acknowledgement: ${JSON.stringify(response)}`, '33'); // Gelb für Empfangsbestätigungen
        return;
    }

    if (isFinished) {
        logWithTimestamp(`Processing finished: ${JSON.stringify(response)}`, '32'); // Grün für abgeschlossene Verarbeitung
        process.exit(0);
    }

    logWithTimestamp(`Unexpected message received: ${data}`, '31'); // Rot für unerwartete Nachrichten
    process.exit(1);
});
