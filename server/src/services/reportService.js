// server/services/reportService.js

import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env.js";


// ============================================
// Gemini Client
// ============================================

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});


// ============================================
// Generate AI Response
// ============================================

export async function generateAIResponse(transcriptHistory) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const conversation = transcriptHistory
      .map((message) => {
        return `${message.role}: ${message.text}`;
      })
      .join("\n");

    console.log("Sending conversation to Gemini...");
    console.log(conversation);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: conversation,

      config: {
        systemInstruction: `
You are an AI health intake assistant.

Your job is to collect exactly these seven pieces
of information:

1. Patient name
2. Age
3. Symptoms
4. When symptoms started
5. Severity from 1 to 10
6. Existing medical conditions
7. Current medications

IMPORTANT RULES:

- Ask exactly ONE question at a time.
- Never ask two questions in one response.
- Remember all previous answers.
- Use the patient's name naturally when appropriate.
- Keep every response short.
- Each question must be a COMPLETE sentence.
- Never stop a sentence halfway.
- Never return an incomplete response.
- Do not diagnose.
- Do not prescribe medication.
- Do not provide medical advice.

Examples:

After receiving a name:

"Thank you, Saiteja. How old are you?"

After receiving an age:

"Thank you. What symptoms are you experiencing?"

After receiving symptoms:

"When did these symptoms start?"

After receiving symptom duration:

"How severe are your symptoms on a scale of 1 to 10?"

After receiving severity:

"Do you have any existing medical conditions?"

After receiving medical conditions:

"Are you currently taking any medications?"

After receiving medications:

"INTAKE_COMPLETE"

Return ONLY the next response.
`,

        maxOutputTokens: 300,
      },
    });

    const aiText = response.text?.trim();

    console.log("Complete Gemini response:");
    console.log(aiText);

    if (!aiText) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    return aiText;

  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("==================================");

    throw error;
  }
}

// ============================================
// Generate Health Report
// ============================================

export async function generateHealthReport(
  transcriptHistory
) {
  try {

    const conversation =
      transcriptHistory
        .map((message) => {
          return `${message.role}: ${message.text}`;
        })
        .join("\n");


    console.log(
      "Generating health report..."
    );


    const response =
      await ai.models.generateContent({

        model: "gemini-3.6-flash",

        contents: conversation,

        config: {

          systemInstruction: `
You are a health intake report generator.

Create a structured summary from the
conversation.

This is NOT a medical diagnosis.

Do not invent information.

If information is missing, use:

"Not provided"

Return ONLY valid JSON.

Use exactly this structure:

{
  "patientName": "",
  "age": "",
  "symptoms": "",
  "symptomStart": "",
  "severity": "",
  "medicalConditions": "",
  "medications": "",
  "summary": "",
  "recommendation": ""
}

The recommendation should state that this
report is for screening/intake purposes only
and that the user should consult a qualified
healthcare professional for medical advice.
`,

          maxOutputTokens: 500,

          responseMimeType:
            "application/json",
        },
      });


    const text =
      response.text?.trim();


    if (!text) {
      throw new Error(
        "Gemini returned an empty report"
      );
    }


    console.log(
      "Gemini report:",
      text
    );


    return JSON.parse(text);

  } catch (error) {

    console.error(
      "================================"
    );

    console.error(
      "GEMINI REPORT ERROR"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Status:",
      error.status
    );

    console.error(
      "Code:",
      error.code
    );

    console.error(
      "================================"
    );

    throw error;
  }
}