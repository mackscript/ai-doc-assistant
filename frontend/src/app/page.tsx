"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'sonner'

const features = [
  {
    number: "01",
    title: "Upload Documents",
    description:
      "Upload your PDF documents and let AI understand their content.",
  },
  {
    number: "02",
    title: "Smart Search",
    description:
      "Find relevant information using semantic search and vector embeddings.",
  },
  {
    number: "03",
    title: "AI Answers",
    description:
      "Ask questions and get answers based on your uploaded documents.",
  },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/chat");
    }
  }, [router]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b14] text-white">

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-blue-500">AI</span> Document Assistant
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm text-gray-300 transition hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>
      </nav>


      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-24 text-center">

        <div className="absolute left-1/2 top-20 -z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />

        <div className="mb-7 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          AI-powered document intelligence
        </div>

        <h1 className="relative max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Your Documents.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Questions. AI Answers.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
          Upload your PDF documents and have meaningful conversations
          with your files. Find information faster with AI-powered
          semantic search.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-8 py-3.5 font-medium transition hover:bg-blue-500"
          >
            Start Chatting →
          </Link>

          <Link
            href="https://github.com/mackscript/ai-doc-assistant"
            target="_blank"
            className="rounded-lg border border-gray-700 px-8 py-3.5 font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            View on GitHub
          </Link>
        </div>


        <div className="mt-20 w-full max-w-4xl rounded-2xl border border-gray-800 bg-[#111827] p-3 text-left shadow-2xl shadow-blue-950/30">

          <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-gray-500">
              AI Document Assistant
            </span>
          </div>

          <div className="grid min-h-64 grid-cols-1 sm:grid-cols-[200px_1fr]">

            <div className="hidden border-r border-gray-800 p-5 sm:block">
              <p className="text-sm font-semibold">Your Documents</p>
              <div className="mt-5 rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm text-gray-300">
                📄 Project.pdf
              </div>
              <div className="mt-3 rounded-lg p-3 text-sm text-gray-500">
                📄 Research.pdf
              </div>
            </div>

            <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
              <div className="ml-auto max-w-xs rounded-xl bg-blue-600 px-4 py-3 text-sm">
                What is this document about?
              </div>

              <div className="max-w-md rounded-xl border border-gray-700 bg-gray-800 px-4 py-4">
                <p className="mb-2 text-sm font-semibold text-blue-400">
                  AI Assistant
                </p>
                <p className="text-sm leading-6 text-gray-300">
                  This document explains the main concepts, key points,
                  and important information from your uploaded file.
                </p>
                <p className="mt-3 text-xs text-gray-500">
                  Source: Project.pdf
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            Everything you need to work with documents
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="rounded-xl border border-gray-800 bg-[#111827] p-7 transition hover:-translate-y-1 hover:border-blue-500/50"
            >
              <p className="text-sm font-semibold text-blue-400">
                {feature.number}
              </p>

              <h3 className="mt-5 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>


      <section className="border-t border-gray-800 bg-[#0c111d] px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="mt-4 text-gray-400">
            Three simple steps to get answers from your documents.
          </p>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {["Upload a PDF", "Ask a Question", "Get AI Answers"].map(
              (step, index) => (
                <div key={step}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/15 font-bold text-blue-400">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 font-semibold">{step}</h3>
                </div>
              )
            )}
          </div>
        </div>
      </section>




      <footer className="border-t border-gray-800 px-6 py-7">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <p>© 2026 AI Document Assistant</p>

          <Link
            href="https://github.com/mackscript/ai-doc-assistant"
            target="_blank"
            className="transition hover:text-white"
          >
            GitHub
          </Link>
        </div>
      </footer>

    </main>
  );
}