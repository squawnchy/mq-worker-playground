// App.js
import React from 'react';
import InputComponent from './InputComponent';
import useWebSocket from './useWebsocket';
import LoadingIndicator from './LoadingIndicator';

const App = () => {
  const { response, sendMessage, isLoading } = useWebSocket('ws://localhost:9001');

  return (
    <div>
      <h1>WebSocket Demo</h1>
      <InputComponent onSend={sendMessage} disabled={false} />
      {isLoading && <LoadingIndicator />}
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

export default App;
