# The Living Book

A UI-first prototype that presents answers as ink writing onto a parchment book page.

## Features

- Single parchment book page interface
- Ink-emergence animation (line-by-line, not character-by-character)
- Each line fades in blurred, then sharpens and darkens
- No chat bubbles, no typing cursor, no streaming tokens, no markdown rendering
- Textured parchment background with serif typography
- Calm, scholarly aesthetic

## Running the Project Locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` (or the port Vite assigns)

The API endpoint at `/api/ask` is handled by Vercel serverless functions in development.

## Usage

1. Type a question in the input field
2. Press Enter
3. Watch as the page "thinks" briefly (400-700ms)
4. The answer emerges line-by-line in ink

## Structure

Each answer contains:
- **Title** - Main heading in larger text
- **Explanation** - Body paragraphs with text indent
- **Practical Guidance** - Sections marked with § symbol
- **Notes** - Marginal notes in lighter italic text

## Customization

- Edit `backend/server.js` to change the response content or integrate with an actual LLM
- Adjust animation timing in `src/BookPage.jsx` (line 38-48)
- Modify visual style in `src/BookPage.css`

## Deployment

The entire app (frontend + backend API) deploys to Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions on deploying to wonderjournal.org.

## Design Principles

This is about feel, not intelligence. The UI controls pacing and animation, not the backend.
