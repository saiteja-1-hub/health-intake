import { useWebSocket } from "./hooks/useWebSocket";

import StatusBadge from "./components/StatusBadge";
import CallController from "./components/CallController";
import Transcript from "./components/Transcript";
import HealthReport from "./components/HealthReport";

function App() {
  const {
    isConnected,
    status,
    messages,
    healthReport,
    startCall,
    endCall,
    sendUserTranscript,
    sendAudio,
  } = useWebSocket();

  return (
    <div className="app">

      {/* =================================
          HEADER
      ================================= */}

      <header className="app-header">
        <h1>AI Voice Health Screener</h1>

        <p>
          Complete your health intake through
          an AI-guided conversation.
        </p>
      </header>


      {/* =================================
          STATUS
      ================================= */}

      <StatusBadge
        status={status}
        isConnected={isConnected}
      />


      {/* =================================
          CALL CONTROLLER
      ================================= */}

      <CallController
        isConnected={isConnected}
        status={status}
        startCall={startCall}
        endCall={endCall}
        sendUserTranscript={sendUserTranscript}
        sendAudio={sendAudio}
      />


      {/* =================================
          CONVERSATION
      ================================= */}

      <Transcript
        messages={messages}
      />


      {/* =================================
          HEALTH REPORT
      ================================= */}

      <HealthReport
        report={healthReport}
      />

    </div>
  );
}

export default App;