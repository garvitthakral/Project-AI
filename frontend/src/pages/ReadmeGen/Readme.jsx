import React, { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../../API/axios";
import { useSocket } from "../../Context/SocketContext";
import Loader from "../../components/Loader";
import GitHubIcon from "../ReadmeGen/components/Github";
import LogLine from "./components/LogLins";

const Readme = () => {
  const { id } = useParams();
  const location = useLocation();
  const repoUrl = location.state?.repoUrl || "";
  const socket = useSocket();
  const started = useRef(false);
  const logRef = useRef(null);
  const [logs, setLogs] = React.useState([]);

  const onStarClick = () => {};

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    socket.emit("joinRoom", id);

    const generateReadme = async () => {
      try {
        const response = await api.post("readme-generator", { repoUrl, id });
        console.log("README generated:", response.data);
      } catch (error) {
        console.error("Error generating README:", error);
      }
    };
    if (repoUrl) {
      generateReadme();
    }

    socket.on("Readme-Status", ({ message, tone }) => {
      console.log(message);
      setLogs((prevLogs) => [...prevLogs, { message, tone }]);
    });
  }, []);

  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6  z-0">
      {/* <h1 className="text-4xl text-white">Generated README for {repoUrl}</h1> */}
      <header className="z-10 flex items-center justify-between px-6 py-5">
        <div></div>
        <a
          href="#"
          className="group inline-flex mt-20 mr-2  items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 py-2 text-sm text-white backdrop-blur transition hover:bg-white/20 hover:shadow-lg"
          aria-label="Open GitHub"
        >
          <GitHubIcon className="h-9 w-9 opacity-80 transition group-hover:opacity-100" />
        </a>
      </header>

      {/* Center content */}
      <main className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pb-20 pt-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
        {/* Heading */}
        <div className="col-span-full flex flex-col items-center text-center">
          <div className="bg-pink-200 px-8 py-4 rounded-4xl cursor-pointer flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <span className="text-transparent text-lg bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 animate-shine flex items-center gap-2">
              README Magic ✨
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-gray-900 drop-shadow-sm sm:text-4xl md:text-5xl dark:text-white">
            We’re crafting your perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 animate-shine">
              README
            </span>
          </h1>
          <p className="mt-2 max-w-2xl text-balance text-sm text-gray-600 dark:text-gray-300">
            Sit back and watch the build log update in real-time while we
            analyze your repo and assemble a professional README.
          </p>
        </div>

        {/* Terminal / Log Panel */}
        <section className="md:order-none order-1">
          <div className="relative rounded-2xl border border-white/15 bg-[#0b0f14] shadow-2xl ring-1 ring-black/5">
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400/90" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
                <span className="h-3 w-3 rounded-full bg-green-400/90" />
              </div>
              <div className="ml-3 text-xs text-gray-300/80">
                readme-generator · bash
              </div>
            </div>

            {/* log body */}
            <div
              ref={logRef}
              className="max-h-[520px] overflow-auto rounded-b-2xl bg-[#0b0f14] p-5 text-[13px] leading-relaxed text-gray-200"
            >
              <pre className="whitespace-pre-wrap font-mono">
                {logs.map((l, i) => (
                  <LogLine key={i} {...l} />
                ))}
              </pre>
            </div>
          </div>
        </section>

        {/* Right Column: CTA + arrow */}
        <aside className="relative flex flex-col items-center justify-center gap-6">
          <Loader size="xl" />
        </aside>
      </main>
    </div>
  );
};

export default Readme;

const defaultLogs = [
  {
    tone: "info",
    text: "Starting README generation for: https://github.com/garvitthakral/LoopMeet_Zoom-clone",
  },
  {
    tone: "ok",
    text: "Cloning repository to: /tmp/LoopMeet_Zoom-clone-1755873161720",
  },
  { tone: "ok", text: "Repository cloned successfully." },
  {
    tone: "info",
    text: "Running Python script: backend/python/agents_groq.py",
  },
  { tone: "ok", text: "Using Gemini model 'gemini-2.0-flash' as primary LLM" },
  { tone: "ok", text: "Groq LLM initialized successfully" },
  { tone: "ok", text: "Repository received" },
  { tone: "info", text: "Initializing README generation process" },
  { tone: "ok", text: "Response received successfully" },
  { tone: "ok", text: "LLM connection test successful: OK" },
  { tone: "info", text: "Starting graph execution..." },
  { tone: "ok", text: "Balanced selection: 39 → 39 → 39 files" },
  { tone: "ok", text: "Selected 15 files for detailed processing" },
  { tone: "info", text: "Detailed batch 1/4: 4 files" },
  { tone: "info", text: "Reading file: frontend/src/API/socket.js" },
];
