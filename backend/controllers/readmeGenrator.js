import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

function parseGithubUrl(url) {
    try {
        const match = url.match(/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?/);
        if(!match) throw new Error("Invalid GitHub URL format");

        return {owner: match[1], repo: match[2]};
    } catch (error) {
        console.error("Error parsing GitHub URL:", error);
        throw error;
    }
}

export async function scanRepo(req, res) {
    try{
        const { repoUrl } = req.body;
        if(!repoUrl) {
            res.status(400).json({ error: "Repository URL is required" });
            return;
        }

        const { owner, repo } = parseGithubUrl(repoUrl);

        const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
      {
        headers: {
          "User-Agent": "ProjectAI",
          "Authorization": process.env.GITHUB_TOKEN
            ? `token ${process.env.GITHUB_TOKEN}`
            : undefined
        }
      });

      if(!githubRes.ok) {
        return res.status(githubRes.status).json({
          error: `GitHub API error: ${githubRes.statusText}`
        });
      }

      const data = await githubRes.json(); // this will give data.tree array of file object
      const allFiles = data.tree.filter(file => file.type === "blob" && file.path.endsWith(".js"));

      const relevantFiles = allFiles.filter(f => {
        if(f.path.includes("test") || f.path.includes("spec") || f.path.includes("node_modules") || f.size > 50 * 1024) {
          return false;
        }
        return /\.(md|js|ts|py|java|go|json)$/i.test(f.path) ||
             /package\.json$|requirements\.txt$/i.test(f.path);
      });

      res.status(200).json({owner, repo, totalFiles: allFiles.length, relevantFiles});
    } catch (error) {
      console.error("Error scanning repository:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}