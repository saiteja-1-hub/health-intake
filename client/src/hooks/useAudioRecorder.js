import { useRef, useState } from "react";

export function useAudioRecorder(sendAudio) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      console.log("Requesting microphone...");

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.onstart = () => {
        console.log("Microphone recording started");
        setIsRecording(true);
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log(
            "Audio chunk:",
            event.data.size,
            "bytes"
          );

          sendAudio(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("Microphone recording stopped");
        setIsRecording(false);
      };

      mediaRecorder.onerror = (event) => {
        console.error(
          "MediaRecorder error:",
          event.error
        );

        setIsRecording(false);
      };

      // Generate an audio chunk every 1 second
      mediaRecorder.start(1000);

    } catch (error) {
      console.error(
        "Microphone error:",
        error
      );

      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    console.log("Stopping microphone...");

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    setIsRecording(false);
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}