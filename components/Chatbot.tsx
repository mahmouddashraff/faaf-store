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
          backgroundColor: "#08a9e6",
          color: "white",
          border: "none",
          fontSize: "30px",
          cursor: "pointer",
          zIndex: 999999,
          boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
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
            backgroundColor: "white",
            borderRadius: "20px",
            overflow: "hidden",
            zIndex: 999998,
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              backgroundColor: "#071426",
              color: "white",
              padding: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                FAAF Assistant
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#b8c1cc",
                  marginTop: "3px",
                }}
              >
                AI Fitness Assistant
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "25px",
                cursor: "pointer",
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
              backgroundColor: "#f5f7fa",
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
                      message.role === "user" ? "#08a9e6" : "white",
                    color:
                      message.role === "user" ? "white" : "#222",
                    padding: "12px 14px",
                    borderRadius: "15px",
                    fontSize: "14px",
                    maxWidth: "85%",
                    whiteSpace: "pre-wrap",
                    boxShadow:
                      message.role === "assistant"
                        ? "0 2px 8px rgba(0,0,0,0.08)"
                        : "none",
                  }}
                >
                  {message.role === "assistant" && (
                    <div
                      style={{
                        color: "#08a9e6",
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
                      FAAF Assistant
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
                  backgroundColor: "white",
                  padding: "12px 14px",
                  borderRadius: "15px",
                  fontSize: "14px",
                  color: "#666",
                  width: "fit-content",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                FAAF Assistant is thinking... 🤔
              </div>
            )}
          </div>

          {/* INPUT */}
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid #ddd",
              backgroundColor: "white",
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
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: "50px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: loading
                  ? "#aaa"
                  : "#08a9e6",
                color: "white",
                fontSize: "20px",
                cursor: loading ? "not-allowed" : "pointer",
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