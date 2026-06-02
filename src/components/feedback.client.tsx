"use client";
import { useEffect } from "react";
import {
  Feedback as FeedbackComponent,
  type ActionResponse,
  type Feedback as FeedbackData,
} from "./feedback";

export default function FeedbackClient() {
  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <FeedbackComponent
      onRateAction={async (
        url: string,
        feedback: FeedbackData,
        turnstileToken: string,
      ) => {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...feedback, url, turnstileToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit feedback");
        }

        return (await response.json()) as ActionResponse;
      }}
    />
  );
}
