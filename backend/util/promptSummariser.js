function buildPromptSummaries(summaries) {
  const header = `Below are compact summaries of important files in the repository. Use them to craft the README. Do NOT invent values that are not in the summaries. If a value (like DB URL) is missing, add a placeholder.`;
  const body = summaries
    .map((s) => {
      // Pretty print each summary depending on kind
      if (s.kind === "package.json") {
        return [
          `---`,
          `Path: ${s.path}`,
          `Kind: package.json`,
          `Name: ${s.name || "-"}`,
          `Description: ${s.description || "-"}`,
          `Scripts: ${
            Object.keys(s.scripts || {}).length
              ? JSON.stringify(s.scripts, null, 2)
              : "-"
          }`,
          `Dependencies: ${
            Object.keys(s.dependencies || {}).length
              ? Object.keys(s.dependencies).slice(0, 50).join(", ")
              : "-"
          }`,
          `DevDependencies: ${
            Object.keys(s.devDependencies || {}).length
              ? Object.keys(s.devDependencies).slice(0, 50).join(", ")
              : "-"
          }`,
        ].join("\n");
      }
      if (s.kind === "readme") {
        return [
          `---`,
          `Path: ${s.path}`,
          `Kind: README/MD`,
          `Preview:`,
          s.preview,
        ].join("\n");
      }
      if (s.kind === "code") {
        return [
          `---`,
          `Path: ${s.path}`,
          `Kind: code`,
          s.imports
            ? `Imports: ${JSON.stringify(s.imports.slice(0, 20), null, 2)}`
            : "",
          s.exports
            ? `Exports: ${JSON.stringify(s.exports.slice(0, 20), null, 2)}`
            : "",
          s.todos ? `TODOs: ${s.todos.join("; ")}` : "",
          `Preview (first lines):`,
          s.preview,
        ]
          .filter(Boolean)
          .join("\n");
      }
      if (s.kind === "config") {
        return [
          `---`,
          `Path: ${s.path}`,
          `Kind: config`,
          `Keys: ${JSON.stringify(s.keys || {}, null, 2)}`,
        ].join("\n");
      }
      return [
        `---`,
        `Path: ${s.path}`,
        `Kind: ${s.kind}`,
        `Preview:`,
        s.preview,
      ].join("\n");
    })
    .join("\n\n");

  return `${header}\n\n${body}\n\nGenerate the README now.`;
}
export default buildPromptSummaries;