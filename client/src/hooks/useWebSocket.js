import { useEffect, useRef, useState } from "react";

export function useWebSocket() {
  const socketRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("DISCONNECTED");
  const [messages, setMessages] = useState([]);
  const [healthReport, setHealthReport] = useState(null);

  // ==========================================
  // CREATE WEBSOCKET CONNECTION
  // ==========================================

  useEffect(() => {
    console.log("Creating WebSocket connection...");

  

const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:5000";

console.log("================================");
console.log("WEBSOCKET URL:", WS_URL);
console.log("================================");

const socket = new WebSocket(WS_URL);

    socketRef.current = socket;

    // ========================================
    // CONNECTED
    // ========================================

    socket.onopen = () => {
      console.log("WebSocket connected");

      setIsConnected(true);
      setStatus("WEBSOCKET_CONNECTED");
    };

    // ========================================
    // MESSAGE FROM SERVER
    // ========================================

    socket.onmessage = (event) => {
      console.log(
        "Raw server message:",
        event.data
      );

      try {
        const data = JSON.parse(event.data);

        console.log(
          "Server message:",
          data
        );

        // ====================================
        // AI RESPONSE
        // ====================================

        if (data.event === "AI_RESPONSE") {
          console.log(
            "AI:",
            data.text
          );

          setMessages((previous) => [
            ...previous,
            {
              role: "assistant",
              text: data.text,
            },
          ]);

          return;
        }

        // ====================================
        // USER TRANSCRIPT
        // ====================================

        if (data.event === "USER_TRANSCRIPT") {
          console.log(
            "User:",
            data.text
          );

          setMessages((previous) => [
            ...previous,
            {
              role: "user",
              text: data.text,
            },
          ]);

          return;
        }

        // ====================================
        // STATUS
        // ====================================

        if (data.event === "STATUS") {
          console.log(
            "Status:",
            data.data
          );

          setStatus(data.data);

          return;
        }

        // ====================================
        // HEALTH REPORT
        // ====================================

        if (data.event === "HEALTH_REPORT") {
          console.log(
            "Health report:",
            data.data
          );

          setHealthReport(data.data);

          return;
        }

        // ====================================
        // ERROR
        // ====================================

        if (data.event === "ERROR") {
          console.error(
            "Server error:",
            data.data
          );

          setStatus("ERROR");

          setMessages((previous) => [
            ...previous,
            {
              role: "error",
              text: data.data,
            },
          ]);

          return;
        }

        console.warn(
          "Unknown event:",
          data.event
        );
      } catch (error) {
        console.error(
          "Failed to parse WebSocket message:",
          error
        );
      }
    };

    // ========================================
    // DISCONNECTED
    // ========================================

    socket.onclose = (event) => {
      console.log(
        "WebSocket disconnected"
      );

      console.log(
        "Close code:",
        event.code
      );

      console.log(
        "Close reason:",
        event.reason
      );

      console.log(
        "Was clean:",
        event.wasClean
      );

      setIsConnected(false);
      setStatus("DISCONNECTED");
    };

    // ========================================
    // ERROR
    // ========================================

    socket.onerror = (error) => {
      console.error(
        "WebSocket error:",
        error
      );

      setStatus("ERROR");
    };

    // ========================================
    // CLEANUP
    // ========================================

    return () => {
      console.log(
        "Cleaning up WebSocket"
      );

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, []);

  // ==========================================
  // SEND JSON MESSAGE
  // ==========================================

  const sendMessage = (message) => {
    console.log(
      "sendMessage called:",
      message
    );

    if (
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
      console.error(
        "WebSocket is not OPEN"
      );

      return false;
    }

    socketRef.current.send(
      JSON.stringify(message)
    );

    console.log(
      "Message sent successfully:",
      message
    );

    return true;
  };

  // ==========================================
  // START CALL
  // ==========================================

  const startCall = () => {
    console.log(
      "================================"
    );

    console.log(
      "START_CALL function called"
    );

    console.log(
      "================================"
    );

    return sendMessage({
      event: "START_CALL",
    });
  };

  // ==========================================
  // END CALL
  // ==========================================

  const endCall = () => {
    console.log(
      "Ending call..."
    );

    return sendMessage({
      event: "END_CALL",
    });
  };

  // ==========================================
  // USER TRANSCRIPT
  // ==========================================

  const sendUserTranscript = (text) => {
    const cleanText = text?.trim();

    if (!cleanText) {
      console.warn(
        "Cannot send empty transcript"
      );

      return false;
    }

    console.log(
      "Sending user transcript:",
      cleanText
    );

    return sendMessage({
      event: "USER_TRANSCRIPT",
      text: cleanText,
    });
  };

  // ==========================================
  // AUDIO
  // ==========================================
  // Keep this function available for later.
  // We are NOT using it during this test.

  const sendAudio = (audioBlob) => {
    if (
      !audioBlob ||
      audioBlob.size === 0
    ) {
      console.warn(
        "Empty audio blob"
      );

      return false;
    }

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      console.log(
        "Sending audio:",
        audioBlob.size,
        "bytes"
      );

      socketRef.current.send(
        audioBlob
      );

      return true;
    }

    console.warn(
      "WebSocket is not connected"
    );

    return false;
  };

  // ==========================================
  // CLEAR CONVERSATION
  // ==========================================

  const clearMessages = () => {
    setMessages([]);
    setHealthReport(null);
  };

  // ==========================================
  // RETURN
  // ==========================================

  return {
    isConnected,
    status,
    messages,
    healthReport,

    startCall,
    endCall,

    sendMessage,
    sendUserTranscript,
    sendAudio,

    clearMessages,
  };
}