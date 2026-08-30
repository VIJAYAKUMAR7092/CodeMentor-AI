"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  question?: string;
  answer?: string;
  created_at?: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    
    const tempId = Date.now();
    setMessages((prev) => [...prev, { id: tempId, question: userMessage }]);
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage, session_id: "demo_session" }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => 
          prev.map((msg) => (msg.id === tempId ? data : msg))
        );
      } else {
        console.error("Failed to fetch response");
      }
    } catch (error) {
      console.error("Error connecting to API", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0F172A] text-slate-200 font-sans">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-900/70 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">CodeMentor <span className="text-indigo-400">AI</span></h1>
        </div>
        <div className="text-xs font-medium px-3 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700">
          Groq Compound
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
              <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl shadow-black/50 border border-slate-700/50 flex items-center justify-center">
                 <span className="text-4xl">💻</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Hi, I'm CodeMentor AI</h2>
              <p className="text-slate-400 text-lg max-w-md">I can help you write code, debug errors, and understand complex programming concepts.</p>
              
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {["Write a Python script to scrape a website", "Explain React Hooks simply", "How do I fix a CORS error?", "Create a SQL query for joins"].map((suggestion, i) => (
                  <button key={i} onClick={() => setInput(suggestion)} className="text-left px-5 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all text-sm text-slate-300">
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg.id} className="flex flex-col space-y-6 animate-fade-in-up">
                
                {/* User Message */}
                {msg.question && (
                  <div className="flex justify-end group">
                    <div className="bg-indigo-600 text-white max-w-[85%] md:max-w-[75%] rounded-3xl rounded-tr-sm px-6 py-4 shadow-md text-sm md:text-base leading-relaxed">
                      {msg.question}
                    </div>
                  </div>
                )}

                {/* AI Response */}
                {(msg.answer || msg.id === Date.now()) && (
                  <div className="flex justify-start">
                    <div className="flex gap-4 max-w-[95%] md:max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm">🤖</span>
                      </div>
                      <div className="bg-slate-800/80 backdrop-blur-sm text-slate-200 rounded-3xl rounded-tl-sm px-6 py-5 shadow-sm border border-slate-700/50 text-sm md:text-base leading-relaxed prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 overflow-hidden">
                        {msg.answer ? (
                          <ReactMarkdown>{msg.answer}</ReactMarkdown>
                        ) : loading ? (
                          <div className="flex items-center gap-3 text-indigo-400 font-medium">
                            <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Thinking & Searching...
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent pt-6 pb-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative flex items-end bg-slate-800 border border-slate-700 rounded-3xl shadow-xl shadow-black/20 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all">
            <textarea
              className="w-full bg-transparent text-slate-100 placeholder-slate-400 pl-6 pr-16 py-4 max-h-32 min-h-[56px] focus:outline-none resize-none scrollbar-thin"
              placeholder="Ask a coding question..."
              value={input}
              rows={1}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-3 bottom-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-full transition-all flex items-center justify-center w-9 h-9"
            >
              {loading ? (
                 <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex justify-between items-center mt-3 px-2">
             <p className="text-xs text-slate-500">
              Press <kbd className="font-sans px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">Enter</kbd> to send, <kbd className="font-sans px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">Shift + Enter</kbd> for new line.
            </p>
             <p className="text-xs text-slate-500">
              AI can make mistakes. Check important code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}