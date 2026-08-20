// server/src/services/ttsService.js

import dotenv from "dotenv";

dotenv.config();


// ============================================
// Convert text to speech using ElevenLabs
// ============================================

export async function textToSpeech(text) {

  try {

    if (!text) {
      throw new Error(
        "Text is required for TTS"
      );
    }


    const voiceId =
      "21m00Tcm4TlvDq8ikWAM";


    const url =
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;


    console.log(
      "Sending text to ElevenLabs..."
    );


    const response =
      await fetch(url, {

        method: "POST",

        headers: {

          "xi-api-key":
            process.env.ELEVENLABS_API_KEY,

          "Content-Type":
            "application/json",

          "Accept":
            "audio/mpeg",
        },

        body: JSON.stringify({

          text,

          model_id:
            "eleven_multilingual_v2",

          voice_settings: {

            stability: 0.5,

            similarity_boost: 0.75,
          },
        }),
      });


    if (!response.ok) {

      const errorText =
        await response.text();

      throw new Error(
        `ElevenLabs error ${response.status}: ${errorText}`
      );
    }


    const audioBuffer =
      Buffer.from(
        await response.arrayBuffer()
      );


    console.log(
      "TTS audio generated:",
      audioBuffer.length,
      "bytes"
    );


    return audioBuffer;

  } catch (error) {

    console.error(
      "TTS Error:",
      error.message
    );

    throw error;
  }
}