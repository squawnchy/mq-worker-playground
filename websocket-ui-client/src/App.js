// App.js
import React from 'react';
import InputComponent from './InputComponent';
import useWebSocket from './useWebsocket';

const App = () => {
  const { response, sendMessage } = useWebSocket('ws://localhost:9001');

  return (
    <div>
      <h1>WebSocket Demo</h1>
      <InputComponent onSend={sendMessage} />
      <p>Response: {response}</p>
    </div>
  );
};

export default App;
