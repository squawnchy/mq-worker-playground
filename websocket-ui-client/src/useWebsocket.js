// useWebSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';

const useWebSocket = (url) => {
    const socket = useRef(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        socket.current = new WebSocket(url);

        socket.current.onopen = () => console.log('WebSocket Connected');
        socket.current.onmessage = (event) => {
            const response = JSON.parse(event.data);
            console.log('WebSocket Message Received:', response);
            if (response.message === 'RECEIVED') {
                setResponse('LOADING...');
                return;
            }
            setResponse(JSON.parse(event.data).pow);
        };
        socket.current.onerror = (error) => console.error('WebSocket Error:', error);
        socket.current.onclose = () => console.log('WebSocket Disconnected');

        return () => {
            socket.current.close();
        };
    }, [url]);

    const sendMessage = useCallback((message) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(message);
        }
    }, []);

    return { response, sendMessage };
};

export default useWebSocket;
