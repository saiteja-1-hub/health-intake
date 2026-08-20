// server/src/websocket/callHandler.js


// ==========================================
// HEALTH QUESTIONS
// ==========================================

const questions = [
  "May I know your name?",

  "How old are you?",

  "What symptoms are you experiencing?",

  "When did these symptoms start?",

  "How severe are your symptoms on a scale of 1 to 10?",

  "Do you have any existing medical conditions?",

  "Are you currently taking any medications?",
];


// ==========================================
// GENERATE HEALTH REPORT
// ==========================================

function generateHealthReport(session) {

  const answers = session.answers || {};


  return {

    patientName:
      answers.name ||
      "Not provided",

    age:
      answers.age ||
      "Not provided",

    symptoms:
      answers.symptoms ||
      "Not provided",

    symptomStart:
      answers.symptomStart ||
      "Not provided",

    severity:
      answers.severity ||
      "Not provided",

    medicalConditions:
      answers.medicalConditions ||
      "None reported",

    medications:
      answers.medications ||
      "None reported",

    recommendation:
      "This intake is for screening purposes only. Please consult a qualified healthcare professional for medical advice or diagnosis.",
  };
}


// ==========================================
// GET ANSWER KEY
// ==========================================

function getAnswerKey(questionIndex) {

  const keys = [
    "name",
    "age",
    "symptoms",
    "symptomStart",
    "severity",
    "medicalConditions",
    "medications",
  ];

  return keys[questionIndex];
}


// ==========================================
// HANDLE CALL MESSAGE
// ==========================================

export async function handleCallMessage(
  ws,
  message,
  session,
  isBinary = false
) {

  try {

    // ======================================
    // AUDIO MESSAGE
    // ======================================

    if (isBinary) {

      console.log(
        "Received audio:",
        message.length,
        "bytes"
      );

      // IMPORTANT:
      // Do NOT JSON.parse audio data.
      //
      // STT / Deepgram will be added later.

      return;
    }


    // ======================================
    // JSON MESSAGE
    // ======================================

    const data =
      JSON.parse(
        message.toString()
      );


    console.log(
      "Received event:",
      data.event
    );


    // ======================================
    // START CALL
    // ======================================

    if (data.event === "START_CALL") {

      console.log(
        "================================"
      );

      console.log(
        "START_CALL received by backend"
      );

      console.log(
        "================================"
      );


      // Reset session

      session.isActive = true;

      session.isProcessing = false;

      session.currentQuestionIndex = 0;

      session.transcriptHistory = [];

      session.answers = {};


      // ====================================
      // FIRST QUESTION
      // ====================================

      const firstQuestion =
        "Hello! I'm here to help with your health intake. May I know your name?";


      // Store AI message

      session.transcriptHistory.push({
        role: "assistant",
        text: firstQuestion,
      });


      console.log(
        "Sending AI_RESPONSE:"
      );

      console.log(
        firstQuestion
      );


      // ====================================
      // SEND AI RESPONSE
      // ====================================

      ws.send(
        JSON.stringify({
          event: "AI_RESPONSE",
          text: firstQuestion,
        })
      );


      // ====================================
      // SEND STATUS
      // ====================================

      ws.send(
        JSON.stringify({
          event: "STATUS",
          data: "CALL_STARTED",
        })
      );


      console.log(
        "START_CALL completed successfully"
      );


      return;
    }


    // ======================================
    // USER TRANSCRIPT
    // ======================================

    if (
      data.event ===
      "USER_TRANSCRIPT"
    ) {

      // ------------------------------------
      // Check active call
      // ------------------------------------

      if (!session.isActive) {

        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: "No active call",
          })
        );

        return;
      }


      // ------------------------------------
      // Get text
      // ------------------------------------

      const userText =
        data.text?.trim();


      if (!userText) {

        console.log(
          "Empty user transcript"
        );

        return;
      }


      console.log(
        "User:",
        userText
      );


      // ------------------------------------
      // Current question
      // ------------------------------------

      const currentIndex =
        session.currentQuestionIndex;


      const answerKey =
        getAnswerKey(
          currentIndex
        );


      // ------------------------------------
      // Store answer
      // ------------------------------------

      if (answerKey) {

        session.answers[
          answerKey
        ] = userText;

      }


      // ------------------------------------
      // Store transcript
      // ------------------------------------

      session.transcriptHistory.push({
        role: "user",
        text: userText,
      });


      // ------------------------------------
      // Send user transcript
      // ------------------------------------

      ws.send(
        JSON.stringify({
          event: "USER_TRANSCRIPT",
          text: userText,
        })
      );


      // ------------------------------------
      // Move to next question
      // ------------------------------------

      session.currentQuestionIndex++;


      // ====================================
      // CHECK COMPLETE
      // ====================================

      if (
        session.currentQuestionIndex >=
        questions.length
      ) {

        console.log(
          "All health questions completed"
        );


        // ----------------------------------
        // Generate report
        // ----------------------------------

        const report =
          generateHealthReport(
            session
          );


        console.log(
          "Generated health report:"
        );

        console.log(
          report
        );


        // ----------------------------------
        // Send report
        // ----------------------------------

        ws.send(
          JSON.stringify({
            event: "HEALTH_REPORT",
            data: report,
          })
        );


        // ----------------------------------
        // Completion message
        // ----------------------------------

        const completionMessage =
          "Thank you. I have collected all the information needed for your health intake.";


        session.transcriptHistory.push({
          role: "assistant",
          text: completionMessage,
        });


        ws.send(
          JSON.stringify({
            event: "AI_RESPONSE",
            text: completionMessage,
          })
        );


        // ----------------------------------
        // Completed status
        // ----------------------------------

        ws.send(
          JSON.stringify({
            event: "STATUS",
            data: "CALL_COMPLETED",
          })
        );


        session.isActive = false;

        session.isProcessing = false;


        console.log(
          "CALL_COMPLETED"
        );


        return;
      }


      // ====================================
      // NEXT QUESTION
      // ====================================

      const nextQuestion =
        questions[
          session.currentQuestionIndex
        ];


      console.log(
        "Next question:"
      );

      console.log(
        nextQuestion
      );


      // Store AI question

      session.transcriptHistory.push({
        role: "assistant",
        text: nextQuestion,
      });


      // ------------------------------------
      // Send AI question
      // ------------------------------------

      ws.send(
        JSON.stringify({
          event: "AI_RESPONSE",
          text: nextQuestion,
        })
      );


      session.isProcessing = false;


      return;
    }


    // ======================================
    // END CALL
    // ======================================

    if (data.event === "END_CALL") {

      console.log(
        "END_CALL received"
      );


      session.isActive = false;

      session.isProcessing = false;


      ws.send(
        JSON.stringify({
          event: "STATUS",
          data: "CALL_ENDED",
        })
      );


      console.log(
        "Call ended successfully"
      );


      return;
    }


    // ======================================
    // UNKNOWN EVENT
    // ======================================

    console.log(
      "Unknown event:",
      data.event
    );


    ws.send(
      JSON.stringify({
        event: "ERROR",
        data:
          `Unknown event: ${data.event}`,
      })
    );

  } catch (error) {

    console.error(
      "================================"
    );

    console.error(
      "CALL HANDLER ERROR"
    );

    console.error(
      "================================"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );


    // Don't send an error if the socket
    // is already closed.

    if (
      ws.readyState === 1
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