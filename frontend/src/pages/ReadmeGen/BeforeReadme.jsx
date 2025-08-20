import React, { useState } from "react";
import { Sparkles } from "lucide-react";

const BeforeReadme = () => {
  const [repoUrl, setRepoUrl] = useState("");
  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex flex-col items-center-safe justify-center h-screen z-0">
      <div className="fixed top-50 bg-pink-200 px-8 py-4 rounded-4xl cursor-pointer flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <Sparkles size={30} className="text-pink-500" />
        <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 animate-shine">
          &nbsp;Powered by GPT
        </span>
      </div>
      <h1 className="text-8xl max-w-7xl align-center justify-center">The Fastest Way to Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 animate-shine">README</span></h1>
      <h2>Your Search Ends Here</h2>

      <input
        type="text"
        name="repoUrl"
        placeholder="https://github.com/username/repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button>Generate →</button>
      <p>⚠️ AI can make Mistakes. Verify before using the generated README.</p>
    </div>
  );
};

export default BeforeReadme;
