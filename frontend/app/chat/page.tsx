"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ChatItem {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchHistory = async () => {
    const token = localStorage.getItem("access");

    if (!token) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chat/history/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
        setQuestion("");
        setSelectedId(data.id);
        fetchHistory();
      } else {
        alert(data.detail || "Request Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 flex">

      {/* Sidebar */}

      <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col">

        <div className="p-5 border-b border-gray-800">

          <h2 className="text-2xl font-bold text-white">
            History
          </h2>

          <button
            onClick={() => {
              setQuestion("");
              setAnswer("");
              setSelectedId(null);
            }}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            + New Chat
          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {history.length === 0 ? (
            <p className="text-gray-400 text-center">
              No Chats Yet
            </p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedId(item.id);
                  setQuestion(item.question);
                  setAnswer(item.answer);
                }}
                className={`p-3 rounded cursor-pointer transition ${
                  selectedId === item.id
                    ? "bg-blue-700"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <p className="text-white text-sm font-medium truncate">
                  {item.question}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}

        </div>

      </aside>

      {/* Chat */}

      <section className="flex-1 flex items-center justify-center p-8">

        <div className="bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-4xl">

          <h1 className="text-3xl font-bold text-white mb-6">
            CodeMentor AI 💻
          </h1>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-36 p-4 rounded bg-gray-800 text-white outline-none resize-none"
            placeholder="Ask your coding question..."
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded disabled:bg-gray-600"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

          <div className="mt-6 bg-gray-800 rounded-lg p-6 min-h-[300px] overflow-auto">

            {loading ? (
              <p className="text-blue-400">🤖 Thinking...</p>
            ) : answer ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-400">
                AI Response will appear here...
              </p>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}