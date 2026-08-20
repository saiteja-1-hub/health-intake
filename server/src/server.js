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


const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.use(
  express.json()
);


// ==========================================
// HTTP ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "AI Voice Health Screener API is running",
  });
});


app.get("/health", (req, res) => {
  res.json({
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

wss.on("connection", (ws) => {

  console.log(
    "================================"
  );

  console.log(
    "WebSocket client connected"
  );

  console.log(
    "================================"
  );


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

      console.log(
        "================================"
      );

      console.log(
        "WebSocket message received"
      );

      console.log(
        "Binary:",
        isBinary
      );

      console.log(
        "Size:",
        message.length
      );

      console.log(
        "================================"
      );


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

      }
    }
  );


  // ========================================
  // CLOSE
  // ========================================

  ws.on("close", () => {

    console.log(
      "WebSocket client disconnected"
    );

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
// START SERVER
// ==========================================

server.listen(
  PORT,
  () => {

    console.log(
      "================================"
    );

    console.log(
      `Server running on http://localhost:${PORT}`
    );

    console.log(
      `WebSocket running on ws://localhost:${PORT}`
    );

    console.log(
      "================================"
    );

  }
);