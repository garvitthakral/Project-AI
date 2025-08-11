import React, { useState } from "react";
import api from "../../src/API/axios.js";
import Loader from "../../components/Loader.jsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CareerChatbot = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/career-chatbot", { prompt: question });
      setQuestion("");
      setAnswer(res.data.reply);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Sorry, I couldn't process your request at the moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Career Chatbot</h1>
        <p className="text-gray-300 text-center mb-6">
          How can I assist you today?
        </p>

        <textarea
          value={question}
          onChange={handleQuestionChange}
          placeholder="Type your question here..."
          className="w-full p-3 rounded-lg bg-black/40 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-white"
          rows={4}
        />

        <div className="mt-4 flex justify-center">
          {loading ? (
            <Loader />
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-500/80 hover:bg-blue-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          )}
        </div>

        {answer && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20 text-gray-200">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal ml-6 mb-2" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="ml-6 list-disc mb-2" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold" {...props} />
                ),
              }}
            >
              {answer}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerChatbot;
