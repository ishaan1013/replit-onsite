import { EvalResponseBody, RequestError, UserMessage } from "./types";

const evaluate = async (
  sessionId: string,
  code: string,
  setMessages: React.Dispatch<
    React.SetStateAction<
      Record<string, (EvalResponseBody | RequestError | UserMessage)[]>
    >
  >,
) => {
  try {
    code = code.replace(/\\n/g, "\n");
    setMessages((prev) => ({
      ...prev,
      [sessionId]: [
        {
          type: "user-message",
          message: code,
          root: crypto.randomUUID(),
        },
        ...(prev[sessionId] || []),
      ],
    }));

    const response = await fetch(
      "https://3f186e0a-8f66-4349-8df7-f1ca0fc79a94-00-25tlsi08a21gq.spock.replit.dev/eval",
      {
        method: "POST",
        body: JSON.stringify({
          code,
          sessionId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();

    setMessages((prev) => ({
      ...prev,
      [sessionId]: [data, ...(prev[sessionId] || [])],
    }));
  } catch (error: unknown) {
    setMessages((prev) => ({
      ...prev,
      [sessionId]: [
        {
          root: crypto.randomUUID(),
          type: "request-error",
          message: String(error),
        },
        ...(prev[sessionId] || []),
      ],
    }));
  }
};

export default evaluate;
