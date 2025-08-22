import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BeforeReadme = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");

  const handleURL = () => {
    if(repoUrl.trim() === "") {
      alert("Please enter a valid GitHub repository URL.");
      return;
    }

    const repoID = Math.random().toString(36).substring(2, 8);

    navigate(`/readme-gen/${repoID}`, { state: { repoUrl } });
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex flex-col items-center-safe justify-center h-screen z-0">
      <div className="fixed top-50 bg-pink-200 px-8 py-4 rounded-4xl cursor-pointer flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <Sparkles size={30} className="text-pink-500" />
        <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 animate-shine">
          &nbsp;Powered by GPT
        </span>
      </div>
      <h1 className="text-8xl max-w-7xl align-center justify-center text-center">
        The Fastest Way to Professional{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 animate-shine">
          README
        </span>
      </h1>
      <h2 className="text-gray-600 text-xl py-4">Your Search Ends Here</h2>

      <div className="flex w-full max-w-3xl items-center gap-3 mt-6 mx-auto">
        <input
          type="text"
          name="repoUrl"
          placeholder="🔗 https://github.com/username/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="flex-1 border border-gray-600/30 bg-white/5 text-white placeholder-gray-400 rounded-xl px-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
        <button onClick={handleURL} className="bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 text-white font-medium rounded-xl px-6 py-3 shadow-lg hover:scale-105 transition-transform animate-shine cursor-pointer">
          Generate →
        </button>
      </div>
      <p className="text-gray-600 text-lg pt-10">
        ⚠️ AI can make Mistakes. Verify before using the generated README.
      </p>
    </div>
  );
};

export default BeforeReadme;
