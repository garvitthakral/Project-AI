import path from "path";
import fs from "fs-extra";
import simpleGit from "simple-git";
import openai from "../aiApi/openAiApi.js";
import { getIO } from "../util/Servers.js";
import buildPromptSummaries from "../util/promptSummariser.js";

const TEMP_DIR = path.join(process.cwd(), "temp_repo");


// to check if the file is extensions are one of the allowed ones.
function ismessageFile(filepath) {
  console.log("entered ismessageFile");
  const messageExtensions =
    /\.(md|js|ts|py|java|go|json|yml|yaml|txt|html|css|jsx|tsx)$/i;
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
  const workingPath = "";
  getIO().to(id).emit("Readme-Status", {
    message: "Starting the Process",
    tone: "info",
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
      tone: "info",
    });
    const repoName = repoUrl
      .split("/")
      .pop()
      .replace(/\.git$/, "");
    const repoOwner = repoUrl.split("/")[repoUrl.split("/").length - 2];

    console.log("getting repo paths");
    getIO().to(id).emit("Readme-Status", {
      message: "Checking Paths😌",
      tone: "ok",
    });
    const repoPath = path.join(TEMP_DIR, `${repoOwner}-${repoName}`);
    workingPath = repoPath;
    await fs.ensureDir(TEMP_DIR); //making sure the folder is created

    // clone the repository
    console.log("cloning repository");
    getIO().to(id).emit("Readme-Status", {
      message: "Cloning of Repo Starts🚀",
      tone: "info",
    });
    await git.clone(repoUrl, repoPath, ["--depth", "1"]);
    getIO().to(id).emit("Readme-Status", {
      message: "Cloning of Repo finish🎉",
      tone: "ok",
    });

    const filesData = [];

    getIO().to(id).emit("Readme-Status", {
      message: "Reading Files 🧑‍🏫",
      tone: "info",
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

          if (isAllowedFile(fullPath) && stat.size < 1000 * 1024) {
            // 1 MB limit
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
      "app.jsx",
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
      tone: "info",
    });
    const importantFiles = filesData.filter((file) =>
      importantPatterns.some(
        (pattern) =>
          file.path.toLowerCase() === pattern ||
          file.path.toLowerCase().endsWith(pattern) ||
          file.path.toLowerCase().includes(pattern)
      )
    );

    //better logic for important files
    function summarizeImportantFile(file) {
      const relPath = file.path;
      const lower = relPath.toLowerCase();

      // If package.json -> parse and return structured fields
      if (path.basename(relPath).toLowerCase() === "package.json") {
        try {
          const pj = JSON.parse(file.content);
          return {
            path: relPath,
            kind: "package.json",
            name: pj.name || null,
            description: pj.description || null,
            scripts: pj.scripts
              ? Object.fromEntries(Object.entries(pj.scripts).slice(0, 20))
              : {},
            dependencies: pj.dependencies
              ? Object.fromEntries(Object.entries(pj.dependencies).slice(0, 60))
              : {},
            devDependencies: pj.devDependencies
              ? Object.fromEntries(
                  Object.entries(pj.devDependencies).slice(0, 60)
                )
              : {},
          };
        } catch (e) {
          return { path: relPath, kind: "package.json", error: "invalid JSON" };
        }
      }

      // README / markdown -> small truncated preview
      if (lower.endsWith(".md") || lower.endsWith(".markdown")) {
        const preview = file.content.split("\n").slice(0, 200).join("\n");
        return { path: relPath, kind: "readme", preview };
      }

      // Code files -> extract imports/exports, top comment, first N lines, TODOs
      if (/\.(js|ts|py|java|go)$/i.test(relPath)) {
        const text = file.content;
        const firstLines = text.split("\n").slice(0, 40).join("\n");
        const imports = [
          ...text.matchAll(/^\s*(?:import|from|const|let|var|require)\b.*$/gim),
        ]
          .map((m) => m[0])
          .slice(0, 30);
        const exports = [
          ...text.matchAll(
            /(?:export\s+default|export\s+{?|module\.exports|class\s+\w+|def\s+\w+)/gim
          ),
        ]
          .map((m) => m[0])
          .slice(0, 40);
        const todos = [
          ...text.matchAll(/(?:\/\/|#|\*|\/\*)\s*(TODO[:\s-]?.+)/gi),
        ]
          .map((m) => m[1])
          .slice(0, 40);
        return {
          path: relPath,
          kind: "code",
          preview: firstLines,
          imports: imports.length ? imports : undefined,
          exports: exports.length ? exports : undefined,
          todos: todos.length ? todos : undefined,
        };
      }

      // Config JSON/YAML -> parse top-level keys (small)
      if (
        lower.endsWith(".json") ||
        lower.endsWith(".yml") ||
        lower.endsWith(".yaml")
      ) {
        try {
          const parsed = JSON.parse(file.content);
          const short = {};
          Object.keys(parsed)
            .slice(0, 50)
            .forEach((k) => {
              short[k] = typeof parsed[k] === "object" ? "[object]" : parsed[k];
            });
          return { path: relPath, kind: "config", keys: short };
        } catch {
          return {
            path: relPath,
            kind: "config",
            preview: file.content.split("\n").slice(0, 40).join("\n"),
          };
        }
      }

      // default small preview
      return {
        path: relPath,
        kind: "other",
        preview: file.content.split("\n").slice(0, 30).join("\n"),
      };
    }

    const importantSummaries = importantFiles.map((f) =>
      summarizeImportantFile(f)
    );

    console.log("generating prompts");
    getIO().to(id).emit("Readme-Status", {
      message: "starting generating Readme File: 🥰",
      tone: "info",
    });
    const systemPrompt = `You are an expert README writer. Produce a professional, friendly, developer-focused README in Markdown.
    Follow this exact structure (and include all sections): 
    1) Project title + tagline in the title,
    2) detailed project summary paragraph (what it is, problem it solves),
    3) 5-7 Key Features with topic and one-liner explanation,
    4) Tech Stack (split into frontend/backend/database/deployment),
    5) Getting Started (prereqs, installation commands, env vars),
    6) Project Structure mention every file you received (tree + comments on key files),
    7) Contributing (steps),
    8) License,
    9) Contact,
    10) Thank you : Thank you for checking out (project name.) We hope you find it useful and enjoy using it. Your feedback and contributions are highly appreciated!.
    11) add a small line at last "Created with ❤️ by ThakralGarvit (Project-AI): https://github.com/garvitthakral/Project-AI/".

    Tone: concise, helpful, slightly enthusiastic. Use headings and subheadings, code blocks for commands, and mention any "future enhancements" if you spot TODOs or commented features. Do NOT invent secrets or specific deployment URLs; if missing, use placeholders like <your-mongodb-connection-string>.`;

    const userPrompt = buildPromptSummaries(importantSummaries);

    console.log("sending request to OpenAI");
    getIO().to(id).emit("Readme-Status", {
      message: "Please wait while we are generating the readme 🙏",
      tone: "warn",
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
    });

    console.log("received response from OpenAI");
    getIO().to(id).emit("Readme-Status", {
      message: "Finishing up Readme",
      tone: "ok",
    });
    const generatedReadme =
      completion.choices[0].message.content || "README generation failed.";

    await fs.remove(repoPath);
    getIO().to(id).emit("Readme-Status", {
      message: "cleaning up the cloned Repo 🧹",
      tone: "warn",
    });

    console.log("cleaned up temporary files");
    getIO().to(id).emit("Readme-Status", {
      message: "Finish ✨",
      tone: "ok",
    });
    res.status(200).json({ repoOwner, repoName, generatedReadme });
  } catch (err) {
    console.error("Error scanning repo locally:", err);
    await fs.remove(workingPath);
    getIO().to(id).emit("Readme-Status", {
      message: "Error processing repository Try again!",
      tone: "warn",
    });
    res.status(500).json({ error: "Failed to process repository" });
  }
}
