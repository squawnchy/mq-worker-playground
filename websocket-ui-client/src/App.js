// App.js
import React from 'react';
import InputComponent from './InputComponent';
import useWebSocket from './useWebsocket';
import LoadingIndicator from './LoadingIndicator';

const App = () => {
  const { response, sendMessage, isLoading } = useWebSocket('ws://localhost:9001');

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold', color: '#3498db', textShadow: '1px 1px 1px #000000' }}>
        <h1>WebSocket Demo</h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <InputComponent onSend={sendMessage} disabled={false} />
        <div style={{ marginLeft: '20px' }}>
          {isLoading && <LoadingIndicator />}
        </div>
      </div >
      <div style={{ marginTop: '20px' }}>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    </>
  );
};

export default App;
