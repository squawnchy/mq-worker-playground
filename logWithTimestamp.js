function logWithTimestamp(message, colorCode = '') {
    const timestamp = new Date().toISOString();
    if (colorCode) {
        console.log(`\x1b[${colorCode}m[${timestamp}] ${message}\x1b[0m`);
    } else {
        console.log(`[${timestamp}] ${message}`);
    }
}

module.exports = logWithTimestamp;