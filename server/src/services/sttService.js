// server/src/services/sttService.js

import { createClient } from "@deepgram/sdk";
import dotenv from "dotenv";

dotenv.config();

const deepgram = createClient(
  process.env.DEEPGRAM_API_KEY
);


// ============================================
// Convert audio buffer to text
// ============================================

export async function speechToText(audioBuffer) {
  try {

    if (!audioBuffer) {
      throw new Error("Audio buffer is required");
    }

    console.log(
      "Sending audio to Deepgram..."
    );


    const { result, error } =
      await deepgram.listen.prerecorded.transcribeFile(
        audioBuffer,
        {
          model: "nova-3",
          smart_format: true,
          language: "en-US",
        }
      );


    if (error) {
      throw error;
    }


    const transcript =
      result?.results?.channels?.[0]
        ?.alternatives?.[0]
        ?.transcript;


    if (!transcript) {

      console.log(
        "Deepgram returned empty transcript"
      );

      return "";
    }


    console.log(
      "Deepgram transcript:",
      transcript
    );


    return transcript;

  } catch (error) {

    console.error(
      "STT Error:",
      error.message
    );

    throw error;
  }
}