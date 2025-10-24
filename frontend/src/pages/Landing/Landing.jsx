import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, BookOpen, Rocket, Wand2 } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const FeatureCard = ({ title, desc, Icon }) => (
  <motion.div variants={fadeInUp} whileHover={{ y: -6, scale: 1.02 }}>
    <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl shadow-lg min-h-[200px]">
      <span className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-white/5 blur-2xl" />
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/20 bg-white/10 p-2">
            <Icon className="size-5 text-white/90" />
          </div>
          <CardTitle className="text-lg font-semibold tracking-tight text-white/90">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-white/80 leading-relaxed">{desc}</CardContent>
    </Card>
  </motion.div>
);

export default function Landing() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.25),rgba(0,0,0,0))] text-white">
      {/* Decorative, soft gradient blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[42rem] rounded-full bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-cyan-400/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        className="pointer-events-none absolute -bottom-32 -left-20 size-[28rem] rounded-full bg-gradient-to-tr from-emerald-400/20 to-sky-400/20 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-28 sm:pt-32">
        {/* Hero */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90">
            <Wand2 className="size-3.5" />
            <span>AI toolkit for careers & dev</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mt-5 bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl md:text-6xl"
          >
            Welcome to <span className="whitespace-nowrap">Project AI</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Multiple AI‑powered tools to accelerate your career and development: analyze your resume, chat through career choices, and auto‑generate polished READMEs.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button size="lg" className="rounded-2xl px-6 py-6 text-base hover:border">
              <Rocket className="mr-2 size-4" /> Get Started
            </Button>
            <Button variant="secondary" size="lg" className="rounded-2xl border border-white/20 bg-white/10 px-6 py-6 text-base text-white/90 hover:text-black">
              Learn More
            </Button>
          </motion.div>
        </motion.section>

        {/* Features */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3"
        >
          <FeatureCard
            title="Resume Analyzer"
            desc="Get instant, actionable feedback with score breakdowns, keyword gaps, and ATS‑friendly suggestions."
            Icon={FileText}
          />
          <FeatureCard
            title="Career Chatbot"
            desc="Ask anything about roles, skills, salaries, and roadmaps—personalized answers backed by your context."
            Icon={MessageSquare}
          />
          <FeatureCard
            title="README Generator"
            desc="Drop a GitHub repo link and generate a clear, professional README with sections and badges."
            Icon={BookOpen}
          />
        </motion.section>

        {/* Floating CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur shadow-xl"
        >
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-white/85 sm:text-left">
              Ready to level up? Start with a quick profile so tools can personalize results for you.
            </p>
            <div className="flex gap-3">
              <Button className="rounded-xl hover:border">Create Profile</Button>
              <Button variant="secondary" className="rounded-xl border border-white/20 bg-transparent text-white/90 hover:text-black">
                Explore Tools
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle parallax dots */}
      <motion.div
        aria-hidden
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </motion.div>
    </div>
  );
}
