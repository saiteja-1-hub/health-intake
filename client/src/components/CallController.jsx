import { useState } from "react";

function CallController({
  isConnected,
  status,
  startCall,
  endCall,
  sendUserTranscript,
}) {
  const [text, setText] = useState("");

  // ==========================================
  // START CALL
  // ==========================================

  const handleStartCall = () => {
    console.log(
      "CALL CONTROLLER: Start Call"
    );

    if (!isConnected) {
      console.error(
        "WebSocket is not connected"
      );

      return;
    }

    startCall();
  };


  // ==========================================
  // END CALL
  // ==========================================

  const handleEndCall = () => {
    console.log(
      "CALL CONTROLLER: End Call"
    );

    endCall();
  };


  // ==========================================
  // SEND TEXT ANSWER
  // ==========================================

  const handleSendText = () => {
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    console.log(
      "Sending typed response:",
      cleanText
    );

    sendUserTranscript(cleanText);

    setText("");
  };


  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendText();
    }
  };


  return (
    <section className="call-controller">

      {/* =====================================
          CONNECTION STATUS
      ===================================== */}

      <div className="connection-info">

        <div className="connection-row">

          <span>
            WebSocket:
          </span>

          <strong
            className={
              isConnected
                ? "connected"
                : "disconnected"
            }
          >
            {isConnected
              ? "Connected"
              : "Disconnected"}
          </strong>

        </div>


        <div className="connection-row">

          <span>
            Status:
          </span>

          <strong>
            {status}
          </strong>

        </div>

      </div>


      {/* =====================================
          CALL BUTTONS
      ===================================== */}

      <div className="call-buttons">

        <button
          className="start-button"
          onClick={handleStartCall}
          disabled={!isConnected}
        >
          Start Call
        </button>


        <button
          className="end-button"
          onClick={handleEndCall}
          disabled={!isConnected}
        >
          End Call
        </button>

      </div>


      {/* =====================================
          TEXT ANSWER
      ===================================== */}

      <div className="text-response">

        <input
          type="text"
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          disabled={!isConnected}
        />


        <button
          className="send-button"
          onClick={handleSendText}
          disabled={
            !isConnected ||
            !text.trim()
          }
        >
          Send
        </button>

      </div>

    </section>
  );
}

export default CallController;