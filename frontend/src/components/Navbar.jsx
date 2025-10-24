import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  Sparkles,
  FileCheck,
  Github,
  Target,
  Mic,
  HelpCircle,
  MessageCircle,
  GraduationCap,
  Lightbulb,
  Code2,
  Briefcase,
  NotebookPen,
  House
  
} from "lucide-react";

/**
 * Project AI – Glassmorphic Centered Navbar
 * - Liquid glass/blurred translucent bar with animated gradient "liquid" blobs
 * - Centered horizontally; fixed with very high z-index so nothing covers it
 * - Mouse-wheel to scroll horizontally when cursor is over the navbar
 * - Scrollbars are hidden visually
 * - Includes 12 feature links (edit labels/links in FEATURES below)
 *
 * Quick usage example (copy into your App.jsx):
 *   export default function App(){
 *     return (
 *       <div className="min-h-[200vh] bg-slate-950 text-white">
 *         <ProjectAIGlassNav centerOnPage={false} />
 *         <div style={{height: "200vh"}}>Page content here</div>
 *       </div>
 *     );
 *   }
 */

const FEATURES = [
  { label: "Home", href: "/", Icon: House },
  { label: "Career Chatbot", href: "career-chatbot", Icon: MessageCircle },
  { label: "Resume Analyzer", href: "resume-analyzer", Icon: FileCheck },
  { label: "GitHub README Gen", href: "readme-gen", Icon: Github },
  { label: "Goal Breakdown", href: "goal-breakdown", Icon: Target },
  { label: "Voice Analysis", href: "voice-analysis", Icon: Mic },
  { label: "Skill Quizzes", href: "skill-quizzes", Icon: GraduationCap },
  { label: "Mock Interviews", href: "mock-interviews", Icon: HelpCircle },
  { label: "Learning Paths", href: "learning-paths", Icon: Sparkles },
  { label: "Project Ideas", href: "project-ideas", Icon: Lightbulb },
  { label: "Code Reviewer", href: "code-reviewer", Icon: Code2 },
  { label: "Job Tracker", href: "job-tracker", Icon: Briefcase },
  { label: "AI Notes", href: "ai-notes", Icon: NotebookPen },
];

export default function Navbar({ centerOnPage = false }) {
  const navRef = useRef(null);
  const listRef = useRef(null);

  // Enable horizontal scrolling with vertical mouse wheel when hovering over the navbar
  useEffect(() => {
    const el = navRef.current;
    const list = listRef.current;
    if (!el || !list) return;

    const onWheel = (e) => {
      // only when mouse is actually over the navbar
      if (!el.matches(":hover")) return;
      if (e.deltaY === 0) return;
      e.preventDefault(); // prevent page vertical scroll
      list.scrollLeft += e.deltaY; // translate vertical wheel to horizontal movement
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel, { passive: false });
    };
  }, []);

  return (
    <>
      {/* styles: keyframes + hide scrollbars utility */}
      <style>{`
        @keyframes floaty {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(10px,-8px) scale(1.05); }
          66% { transform: translate(-10px,6px) scale(0.98); }
          100% { transform: translate(0,0) scale(1); }
        }
        /* Hide scrollbars for the custom class on all major browsers */
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <nav
        ref={navRef}
        className={[
          "pointer-events-auto",
          "fixed left-1/2 -translate-x-1/2",
          centerOnPage ? "top-1/2 -translate-y-1/2" : "top-6",
          "z-[9999]",
          "max-w-[92vw]",
        ].join(" ")}
        aria-label="Project AI main navigation"
      >
        {/* Liquid gradient backdrop blobs */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute -top-6 -left-10 h-24 w-24 rounded-full blur-3xl opacity-60"
            style={{
              background:
                "radial-gradient(35% 35% at 50% 50%, rgba(168,85,247,0.8) 0%, rgba(79,70,229,0.6) 50%, rgba(14,165,233,0.4) 100%)",
              animation: "floaty 8s ease-in-out infinite",
              filter: "blur(32px)",
            }}
          />
          <div
            className="absolute -bottom-6 -right-12 h-28 w-28 rounded-full blur-3xl opacity-50"
            style={{
              background:
                "radial-gradient(35% 35% at 50% 50%, rgba(34,197,94,0.9) 0%, rgba(16,185,129,0.6) 50%, rgba(59,130,246,0.4) 100%)",
              animation: "floaty 10s ease-in-out infinite reverse",
              filter: "blur(36px)",
            }}
          />
        </div>

        {/* Glass container */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-900/40 rounded-2xl md:rounded-full px-3 md:px-4 py-2">
          <ul
            ref={listRef}
            className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar max-w-[92vw]"
          >
            {FEATURES.map(({ label, href, Icon }) => (
              <li key={label} className="flex-shrink-0">
                <NavLink to={href}
                  className="group inline-flex items-center gap-2 rounded-xl md:rounded-full px-3 md:px-4 py-2 transition-all duration-200 border border-white/10 hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5 opacity-90 group-hover:opacity-100" />
                  <span className="text-xs md:text-sm font-medium tracking-tight whitespace-nowrap">
                    {label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* helper: keep content from hiding under the nav on top placement */}
      {!centerOnPage && <div className="h-20" aria-hidden="true" />}
    </>
  );
}
