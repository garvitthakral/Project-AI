import React, { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../../API/axios";
import { useSocket } from "../../Context/SocketContext";
import Loader from "../../components/Loader";
import GitHubIcon from "../ReadmeGen/components/Github";
import LogLine from "./components/LogLins";
import GenratedReadme from "./components/GenratedReadme";

const Readme = () => {
  const { id } = useParams();
  const location = useLocation();
  const repoUrl = location.state?.repoUrl || "";
  const socket = useSocket();
  const started = useRef(false);
  const logRef = useRef(null);
  const [logs, setLogs] = React.useState([]);
  const [isFinished, setIsFinished] = React.useState(false);
  const [response, setResponse] = React.useState({
    repoOwner: "repo_Owner",
    repoName: "repo_Name",
    generatedReadme:
      "```markdown\n# GrindHub - Task Management Application 🚀\n\n![GrindChain Banner](https://iili.io/Fk8Exv2.png)\n\nGrindChain is a comprehensive task management application designed to help users efficiently organize, prioritize, and track tasks. It features a user-friendly interface built with React, real-time updates, and AI-powered automation.\n\n## 🌟 Key Features\n\n- **User Authentication**: Secure login, signup, and logout using JWT and cookies.\n- **AI-Powered Task Generation**: AI chatbot assists in creating tasks from natural language.\n- **Real-time Communication**: Socket.IO enables live updates for tasks and notifications.\n- **Dashboard**: Personalized overview with statistics and upcoming tasks.\n- **Task Management**: Create, update, delete, and track progress of tasks.\n- **Profile Management**: Edit/view your profile, avatar, and description.\n- **Chatroom**: Real-time chat for individuals and groups.\n- **Analytics**: Visual performance insights with charts and graphs.\n- **Responsive Design**: Fully functional across all devices.\n- **Protected Routes**: Auth-gated pages with lazy loading for optimal performance.\n\n## 🛠️ Tech Stack\n\n### Frontend\n- **Framework**: React with React Router DOM\n- **Styling**: Tailwind CSS, Heroicons, Heroui\n- **Animation**: Framer Motion, GSAP, OGL\n- **Visualization**: React Circular Progressbar, Recharts\n- **Real-time**: Socket.IO Client\n- **Build Tool**: Vite\n\n### Backend\n- **Runtime**: Node.js with Express.js\n- **Real-time**: Socket.IO\n- **Database**: MongoDB\n- **Authentication**: JWT (JSON Web Tokens)\n\n## 🚀 Getting Started\n\n### Prerequisites\n- Node.js (>=16.x)\n- npm (>=8.x)\n- MongoDB Atlas account or local MongoDB instance\n\n### Installation\n\n1. Clone the repository:\n   ```bash\n   git clone https://github.com/yourusername/GrindChain.git\n   cd GrindChain\n   ```\n\n2. Install dependencies for both frontend and backend:\n   ```bash\n   cd frontend && npm install\n   cd ../backend && npm install\n   ```\n\n3. Set up environment variables (see below).\n\n### Running the Application\n\n1. Start the backend server:\n   ```bash\n   cd backend\n   npm run dev\n   ```\n\n2. Start the frontend development server:\n   ```bash\n   cd frontend\n   npm run dev\n   ```\n\nThe application should now be running:\n- Frontend: [http://localhost:5173](http://localhost:5173)\n- Backend: [http://localhost:5001](http://localhost:5001)\n\n## 🔐 Environment Configuration\n\nCreate a `.env` file in the `backend` directory with the following variables:\n```env\n# Server Configuration\nPORT=5001\nFRONTEND_URL=http://localhost:5173\n\n# Authentication\nJWT_SECRET=your_secure_jwt_secret\nJWT_EXPIRE=24h\n\n# Database\nMONGODB_URI=your_mongodb_connection_string\n\n# AI Services\nGEMINI_API_KEY=your_gemini_api_key\n```\n\n## 📂 Project Structure\n\n```\nGrindChain/\n├── backend/                  # Backend server code\n│   ├── controllers/          # Route controllers\n│   ├── models/               # MongoDB models\n│   ├── routes/               # API routes\n│   ├── utils/                # Utility functions\n│   ├── app.js                # Express app configuration\n│   ├── server.js             # Server entry point\n│   └── .env                  # Environment variables\n│\n├── frontend/                 # Frontend React application\n│   ├── public/               # Static assets\n│   ├── src/\n│   │   ├── API/              # API communication\n│   │   ├── assets/           # Images, icons, etc.\n│   │   ├── components/       # Reusable components\n│   │   ├── contexts/         # React contexts\n│   │   ├── pages/            # Application pages\n│   │   ├── App.jsx           # Main app component\n│   │   └── main.jsx          # Entry point\n│   ├── vite.config.js        # Vite configuration\n│   └── package.json\n│\n├── .gitignore\n└── README.md\n```\n\n## 🤝 Contributing\n\nWe welcome contributions! Please follow these steps:\n1. Fork the repository.\n2. Create a new branch (`git checkout -b feature/your-feature`).\n3. Commit your changes (`git commit -am 'Add some feature'`).\n4. Push to the branch (`git push origin feature/your-feature`).\n5. Open a Pull Request.\n\n## 📬 Contact\n\nFor questions or suggestions, please contact:\n- **Garvit Thakral** - [thakralgarvit1@gmail.com](mailto:thakralgarvit1@gmail.com)\n- **GitHub**: [@garvitthakral](https://github.com/garvitthakral)\n\n## 📄 License\n\nThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.\n```\n",
  });

  function stripFenced(raw = "") {
    const trimmed = raw.trim();
    const m = trimmed.match(/^```(?:\w+)?\n([\s\S]*)\n```$/);
    return m ? m[1] : trimmed;
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    socket.emit("joinRoom", id);

    const generateReadme = async () => {
      try {
        const response = await api.post("readme-generator", { repoUrl, id });
        console.log("README generated:", response.data);
        const { generatedReadme, repoOwner, repoName } = response.data;
        setResponse({
          generatedReadme: stripFenced(generatedReadme),
          repoOwner: repoOwner,
          repoName: repoName,
        });
        setIsFinished(true);
      } catch (error) {
        console.error("Error generating README:", error);
      }
    };
    if (repoUrl) {
      generateReadme();
    }

    socket.on("Readme-Status", ({ message, content, tone }) => {
      console.log(message);
      if (content) {console.log("Readme content received: ", content);}
      setLogs((prevLogs) => [...prevLogs, { message, tone }]);
    });
  }, []);

  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6  z-0 overflow-y-scroll">
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
      <main className="">
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

        {isFinished ? (
          <>
            <GenratedReadme response={response} />
          </>
        ) : (
          <>
          <div className="flex gap-8 max-w-7xl justify-between items-center mt-18">
            {/* Terminal / Log Panel */}
            <section className="md:order-none order-1 w-1/2">
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
            <aside className="relative flex flex-col items-center justify-center gap-6 w-1/2" >
              <Loader size="xl" />
            </aside>{" "}
            </div>
          </>
        )}
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
