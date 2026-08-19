"use client";

import { useState } from "react";
import { createClient } from "../utils/supabase/client";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! 👋 Welcome to FAAF Fitness Magic. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.functions.invoke("chatbot", {
        body: {
          message: message,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message);
      }

      if (!data?.response) {
        throw new Error("No response from AI");
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry 😔 I couldn't connect to the AI right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* CHATBOT BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #fae59e 0%, #dfb76c 45%, #b98a28 100%)",
          color: "#070709",
          border: "none",
          fontSize: "28px",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 999999,
          boxShadow: "0 8px 25px rgba(223, 183, 108, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        aria-label="Open FAAF Assistant"
      >
        {isOpen ? "×" : "💬"}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "105px",
            right: "25px",
            width: "360px",
            height: "500px",
            backgroundColor: "#0d0d12",
            borderRadius: "20px",
            border: "1px solid rgba(223, 183, 108, 0.3)",
            overflow: "hidden",
            zIndex: 999998,
            boxShadow: "0 20px 50px rgba(0,0,0,0.85), 0 0 30px rgba(223, 183, 108, 0.15)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              backgroundColor: "#08080b",
              borderBottom: "1px solid rgba(223, 183, 108, 0.2)",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "900",
                  fontFamily: "Outfit, sans-serif",
                  color: "#fae59e",
                  letterSpacing: "0.02em",
                }}
              >
                FAAF Assistant
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginTop: "2px",
                  fontWeight: "600",
                }}
              >
                AI Fitness Specialist
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "none",
                color: "#94a3b8",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                fontSize: "18px",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "color 0.15s ease",
              }}
            >
              ×
            </button>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              backgroundColor: "#070709",
              overflowY: "auto",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    message.role === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      message.role === "user"
                        ? "#dfb76c"
                        : "#13131a",
                    color:
                      message.role === "user" ? "#070709" : "#e2e8f0",
                    border:
                      message.role === "user"
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "12px 14px",
                    borderRadius: "15px",
                    fontSize: "13.5px",
                    fontWeight: message.role === "user" ? "600" : "400",
                    maxWidth: "85%",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    boxShadow:
                      message.role === "assistant"
                        ? "0 4px 15px rgba(0,0,0,0.5)"
                        : "0 2px 8px rgba(223, 183, 108, 0.25)",
                  }}
                >
                  {message.role === "assistant" && (
                    <div
                      style={{
                        color: "#dfb76c",
                        fontWeight: "800",
                        fontSize: "11px",
                        letterSpacing: "0.05em",
                        marginBottom: "4px",
                      }}
                    >
                      FAAF ASSISTANT
                    </div>
                  )}

                  {message.text}
                </div>
              </div>
            ))}

            {/* LOADING */}
            {loading && (
              <div
                style={{
                  backgroundColor: "#13131a",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "12px 14px",
                  borderRadius: "15px",
                  fontSize: "13px",
                  color: "#94a3b8",
                  width: "fit-content",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                }}
              >
                FAAF Assistant is analyzing... ⚡
              </div>
            )}
          </div>

          {/* INPUT */}
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "#0d0d12",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask FAAF something..."
              style={{
                flex: 1,
                minWidth: 0,
                padding: "10px 14px",
                border: "1px solid rgba(223, 183, 108, 0.25)",
                borderRadius: "12px",
                outline: "none",
                fontSize: "13.5px",
                backgroundColor: "#15151e",
                color: "#f1f5f9",
              }}
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: "44px",
                border: "none",
                borderRadius: "12px",
                background: loading
                  ? "#22222c"
                  : "linear-gradient(135deg, #fae59e 0%, #dfb76c 45%, #b98a28 100%)",
                color: loading ? "#64748b" : "#070709",
                fontSize: "16px",
                fontWeight: "900",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "grid",
                placeItems: "center",
                boxShadow: loading ? "none" : "0 2px 10px rgba(223, 183, 108, 0.35)",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}