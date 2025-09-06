import React from "react";
import { Editor } from "@monaco-editor/react";
import { FaCopy } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const GenratedReadme = ({ response }) => {
  const [copied, setCopied] = React.useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(response.generatedReadme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div>
      <div className="md:flex gap-8 md:px-10 px-4 py-16">
        {/* Editor Panel */}
        <div className="relative border border-gray-700 rounded-3xl overflow-hidden bg-gray-900 md:w-1/2 w-full shadow-xl shadow-gray-900">
          <Editor
            height={"100vh"}
            defaultLanguage="markdown"
            value={response.generatedReadme}
            onChange={""}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 22,
              padding: { top: 20, bottom: 20 },
              scrollBeyondLastLine: false,
              scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
              },
              overviewRulerLanes: 0,
              wordWrap: "on",
              automaticLayout: true,
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              cursorStyle: "line",
              selectOnLineNumbers: true,
              roundedSelection: false,
              selectionHighlight: false,
              lineNumbers: "on",
              glyphMargin: false,
              folding: true,
              renderLineHighlight: "gutter",
            }}
          />
          <div className="flex items-center gap-2 absolute top-3 right-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md border border-gray-600 transition-all duration-200 z-10"
            >
              {copied ? (
                <>
                  Copied
                  <FaCheck className="h-3 w-3" />
                </>
              ) : (
                <>
                  <FaCopy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>

            <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-md border border-gray-600 z-10">
              README.md
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-full border mt-16 md:mt-0 border-gray-300 rounded-3xl bg-rose-50/50 shadow-xl shadow-cyan-400">
          <div className="bg-white border-t  border-rose-300 px-4 py-2 text-sm font-medium text-gray-700 flex items-center gap-2 rounded-t-3xl">
            📖 Preview
          </div>
          <div
            className="py-6 px-8 overflow-y-auto bg-white rounded-b-3xl"
            style={{
              height: "100vh",
              fontFamily:
                '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => (
                  <h1
                    className="text-4xl font-bold pb-3 mb-6 border-b border-gray-200 text-black"
                    style={{ marginTop: "0" }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold pb-2 mb-5 mt-8 border-b text-black">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl font-semibold mb-3 mt-7 text-black">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p
                    className="mb-6 text-gray-900 leading-7"
                    style={{ fontSize: "18px" }}
                  >
                    {children}
                  </p>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code
                      className="px-2 py-1 rounded font-mono"
                      style={{
                        backgroundColor: "rgba(175,184,193,0.2)",
                        color: "#24292f",
                        fontSize: "16px",
                      }}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre
                    className="p-6 rounded-md overflow-x-auto mb-6 text-base"
                    style={{
                      backgroundColor: "#f6f8fa",
                      color: "#24292f",
                      border: "1px solid #d0d7de",
                      fontSize: "16px",
                      lineHeight: "1.5",
                    }}
                  >
                    {children}
                  </pre>
                ),
                ul: ({ children }) => (
                  <ul
                    className="pl-8 mb-6 space-y-2"
                    style={{ listStyleType: "disc" }}
                  >
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol
                    className="pl-8 mb-6 space-y-2"
                    style={{ listStyleType: "decimal" }}
                  >
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li
                    className="text-gray-900 leading-7"
                    style={{ fontSize: "18px" }}
                  >
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className="pl-6 my-6"
                    style={{
                      borderLeft: "4px solid #d0d7de",
                      color: "#656d76",
                      fontSize: "18px",
                    }}
                  >
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:underline font-medium"
                    style={{ color: "#0969da", fontSize: "18px" }}
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={alt}
                    className="max-w-full h-auto my-6"
                    style={{ border: "1px solid #d0d7de", borderRadius: "6px" }}
                  />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6">
                    <table
                      className="border-collapse w-full text-base"
                      style={{ border: "1px solid #d0d7de" }}
                    >
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th
                    className="px-4 py-3 text-left font-semibold"
                    style={{
                      backgroundColor: "#f6f8fa",
                      border: "1px solid #d0d7de",
                      color: "#24292f",
                      fontSize: "16px",
                    }}
                  >
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td
                    className="px-4 py-3"
                    style={{
                      border: "1px solid #d0d7de",
                      color: "#24292f",
                      fontSize: "16px",
                    }}
                  >
                    {children}
                  </td>
                ),
              }}
            >
              {response.generatedReadme}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenratedReadme;
