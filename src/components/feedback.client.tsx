"use client";
import {
  Feedback as FeedbackComponent,
  type ActionResponse,
  type Feedback as FeedbackData,
} from "./feedback";

export default function FeedbackClient() {
  return (
    <FeedbackComponent
      onRateAction={async (url: string, feedback: FeedbackData) => {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...feedback, url }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit feedback");
        }

        return (await response.json()) as ActionResponse;
      }}
    />
  );
}
