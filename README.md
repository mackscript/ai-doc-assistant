# AI Document Assistant

An AI-powered application that allows users to upload PDF documents and ask questions using AI.

## Live Demo

[AI Document Assistant](https://ai-doc-assistant-sable.vercel.app/)

## Features

- JWT Authentication (Register/Login)
- PDF Upload (up to 10 MB)
- PDF Text Extraction
- Text Chunking & Embeddings
- Semantic Search with MongoDB Atlas Vector Search
- AI-powered Answers using Google Gemini
- Chat History & Chat Management

## Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS

**Backend:** Node.js, Express, TypeScript

**Database:** MongoDB Atlas, Vector Search

**AI:** Google Gemini API

**Deployment:** Vercel, Render

## Architecture

1. Upload a PDF.
2. Extract and split text into chunks.
3. Generate embeddings using Gemini.
4. Store embeddings in MongoDB.
5. Search relevant chunks using Vector Search.
6. Generate answers using Gemini.

## Run Locally

```bash
# Clone repository
git clone https://github.com/mackscript/ai-doc-assistant.git

# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev