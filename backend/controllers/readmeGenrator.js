import path from "path";
import fs from "fs-extra";
import simpleGit from "simple-git";
import openai from "../aiApi/openAiApi.js";
import { getIO } from "../util/Servers.js";

const TEMP_DIR = path.join(process.cwd(), "temp_repo");

// to check if the file is extensions are one of the allowed ones.
function ismessageFile(filepath) {
  console.log("entered ismessageFile");
  const messageExtensions = /\.(md|js|ts|py|java|go|json|yml|yaml|txt|html|css)$/i;
  return messageExtensions.test(filepath);
}

// to check if the file is big or not
function isAllowedFile(filePath) {
  console.log("entered isAllowedFile");
  if (filePath.includes("node_modules") || filePath.includes(".git"))
    return false;
  if (filePath.includes("__tests__") || filePath.includes("spec")) return false;
  return ismessageFile(filePath);
}

// main function to generate README
export async function scanRepoLocal(req, res) {
  const { id } = req.body;
  getIO().to(id).emit("Readme-Status", {
    message: "Starting the Process",
    tone: "info"
  });
  console.log("entered scanRepoLocal");
  const git = simpleGit();

  const { repoUrl } = req.body;
  if (!repoUrl) {
    return res.status(400).json({ error: "Repository URL is required" });
  }

  try {
    //taking out repo information
    console.log("getting names");
    getIO().to(id).emit("Readme-Status", {
      message: "fetching repository name",
      tone: "info"
    });
    const repoName = repoUrl
      .split("/")
      .pop()
      .replace(/\.git$/, "");
    const repoOwner = repoUrl.split("/")[repoUrl.split("/").length - 2];

    console.log("getting repo paths");
    getIO().to(id).emit("Readme-Status", {
      message: "Checking Paths😌",
      tone: "ok"
    });
    const repoPath = path.join(TEMP_DIR, `${repoOwner}-${repoName}`);
    await fs.ensureDir(TEMP_DIR); //making sure the folder is created

    // clone the repository
    console.log("cloning repository");
    getIO().to(id).emit("Readme-Status", {
      message: "Cloning of Repo Starts🚀",
      tone: "info"
    });
    await git.clone(repoUrl, repoPath, ["--depth", "1"]);
    getIO().to(id).emit("Readme-Status", {
      message: "Cloning of Repo finish🎉",
      tone: "ok"
    });

    const filesData = [];

    getIO().to(id).emit("Readme-Status", {
      message: "Reading Files 🧑‍🏫",
      tone: "info"
    });
    async function walk(dir) {
      console.log("entered in walk");
      const files = await fs.readdir(dir);

      // Process all files/folders in parallel
      await Promise.all(
        files.map(async (file) => {
          const fullPath = path.join(dir, file);
          const stat = await fs.stat(fullPath);

          if (stat.isDirectory()) {
            // Recursively scan subdirectory
            return walk(fullPath);
          }

          if (isAllowedFile(fullPath) && stat.size < 100 * 1024) {
            // 100 KB limit
            const content = await fs.readFile(fullPath, "utf8");
            console.log("pushing file");
            filesData.push({
              path: path.relative(repoPath, fullPath),
              content,
            });
          }
        })
      );
    }
    console.log("entering walk");
    await walk(repoPath);

    const importantPatterns = [
      "package.json",
      "readme.md",
      "index.js",
      "app.js",
      "server.js",
      ".env.example",
      "config",
      "vite.config.js",
      "webpack.config.js",
      "routes",
      "controllers",
    ];
    console.log("filtering important files");
    getIO().to(id).emit("Readme-Status", {
      message: "Filtering Important files: 📁",
      tone: "info"
    });
    const importantFiles = filesData.filter((file) =>
      importantPatterns.some(
        (pattern) =>
          file.path.toLowerCase() === pattern ||
          file.path.toLowerCase().endsWith(pattern) ||
          file.path.toLowerCase().includes(pattern)
      )
    );

    console.log("generating prompts");
    getIO().to(id).emit("Readme-Status", {
      message: "starting generating Readme File: 🥰",
      tone: "info"
    });
    const systemPrompt = `You are an expert software documentation generator. Generate a detailed README for   the following structured section:
      🌟 Key Features
      🛠️ Tech Stack
      🚀 Getting Started
      🔐 Environment Configuration
      📂 Project Structure
      🤝 Contributing
      📬 Contact
      📄 License

      Use markdown formatting with headings and subheadings. Use bullet points where appropriate. Make it clear, concise and professional.`;

    const userPrompt = `Below are important files from the project with their paths and contents. Use these to write the README.md:
      ${importantFiles
        .map((f) => `File: ${f.path}\nContent:\n${f.content}`)
        .join("\n\n")}`;

    console.log("sending request to OpenAI");
    getIO().to(id).emit("Readme-Status", {
      message: "Please wait while we are generating the readme 🙏",
      tone: "warn"
    });
    getIO().to(id).emit("Readme-Status", {
      message: "here is User Prompt",
      content: userPrompt,
      tone: "warn"
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2500,
      temperature: 0.7,
    });

    console.log("received response from OpenAI");
    getIO().to(id).emit("Readme-Status", {
      message: "Finishing up Readme",
      tone: "ok"
    });
    const generatedReadme =
    completion.choices[0].message.content || "README generation failed.";

    await fs.remove(repoPath);
    getIO().to(id).emit("Readme-Status", {
      message: "cleaning up the cloned Repo 🧹",
      tone: "warn"
    });

    console.log("cleaned up temporary files");
    getIO().to(id).emit("Readme-Status", {
      message: "Finish ✨",
      tone: "ok"
    });
    res.status(200).json({ repoOwner, repoName, generatedReadme });
  } catch (err) {
    console.error("Error scanning repo locally:", err);
    res.status(500).json({ error: "Failed to process repository" });
  }
}
