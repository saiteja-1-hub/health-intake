import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import {
  PORT,
  CLIENT_URL,
} from "./config/env.js";

import {
  handleCallMessage,
} from "./websocket/callHandler.js";


// ==========================================
// EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.use(express.json());


// ==========================================
// HTTP ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Voice Health Screener API is running",
  });
});


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
  });
});


// ==========================================
// HTTP SERVER
// ==========================================

const server = createServer(app);


// ==========================================
// WEBSOCKET SERVER
// ==========================================

const wss = new WebSocketServer({
  server,
});


// ==========================================
// WEBSOCKET CONNECTION
// ==========================================

wss.on("connection", (ws, request) => {

  console.log("================================");
  console.log("WebSocket client connected");
  console.log(
    "Client:",
    request.socket.remoteAddress
  );
  console.log("================================");


  // ========================================
  // CREATE SESSION
  // ========================================

  const session = {
    isActive: false,
    isProcessing: false,
    transcriptHistory: [],
    currentQuestionIndex: 0,
    answers: {},
  };


  // ========================================
  // SEND CONNECTION STATUS
  // ========================================

  ws.send(
    JSON.stringify({
      event: "STATUS",
      data: "WEBSOCKET_CONNECTED",
    })
  );


  // ========================================
  // RECEIVE MESSAGE
  // ========================================

  ws.on(
    "message",
    async (message, isBinary) => {

      console.log("================================");
      console.log("WebSocket message received");
      console.log("Binary:", isBinary);
      console.log("Size:", message.length);
      console.log("================================");


      try {

        await handleCallMessage(
          ws,
          message,
          session,
          isBinary
        );

      } catch (error) {

        console.error(
          "WebSocket handler error:",
          error
        );


        // Don't crash the WebSocket
        if (
          ws.readyState === ws.OPEN
        ) {

          ws.send(
            JSON.stringify({
              event: "ERROR",
              data:
                "Something went wrong while processing your request.",
            })
          );

        }

      }

    }
  );


  // ========================================
  // CLOSE
  // ========================================

  ws.on("close", (code, reason) => {

    console.log("================================");
    console.log(
      "WebSocket client disconnected"
    );
    console.log("Close code:", code);
    console.log(
      "Close reason:",
      reason?.toString() || ""
    );
    console.log("================================");

    session.isActive = false;

  });


  // ========================================
  // ERROR
  // ========================================

  ws.on("error", (error) => {

    console.error(
      "WebSocket error:",
      error
    );

  });

});


// ==========================================
// WEBSOCKET SERVER ERROR
// ==========================================

wss.on("error", (error) => {

  console.error(
    "WebSocket server error:",
    error
  );

});


// ==========================================
// START SERVER
// ==========================================

server.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log("================================");
    console.log(
      `HTTP server running on port ${PORT}`
    );
    console.log(
      `WebSocket server running on port ${PORT}`
    );
    console.log(
      `Client URL: ${CLIENT_URL}`
    );
    console.log("================================");

  }
);


// ==========================================
// SERVER ERROR
// ==========================================

server.on("error", (error) => {

  console.error(
    "HTTP server error:",
    error
  );

});