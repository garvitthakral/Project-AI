import React, { useState } from "react";
import api from "../../src/API/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "../../components/Loader";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setAnalysis("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a PDF resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post("/resume-analyzer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnalysis(res.data.feedback || "No feedback received.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error analyzing resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex items-center justify-center">
  <div className="w-full max-w-6xl bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 text-gray-200">
    <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
      Resume Analyzer
    </h1>

    <label className="block mb-4">
      <span className="text-sm text-gray-400">Upload your PDF Resume</span>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mt-2 block w-full text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-gradient-to-r file:from-blue-500 file:to-indigo-500
          hover:file:from-blue-600 hover:file:to-indigo-600
          transition-all duration-200 cursor-pointer"
      />
    </label>

    <button
      onClick={handleAnalyze}
      disabled={loading}
      className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {loading ? "Analyzing..." : "Analyze Resume"}
    </button>

    {error && (
      <p className="text-red-400 mt-4 text-center bg-red-500/10 p-3 rounded-lg border border-red-500/30">
        {error}
      </p>
    )}

    {analysis && (
      <div className="mt-6 p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow-inner">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            ol: (props) => <ol className="list-decimal ml-6 mb-2 space-y-1" {...props} />,
            ul: (props) => <ul className="list-disc ml-6 mb-2 space-y-1" {...props} />,
            strong: (props) => <strong className="font-bold text-green-400" {...props} />,
          }}
        >
          {analysis}
        </ReactMarkdown>
      </div>
    )}
  </div>
</div>

  );
}