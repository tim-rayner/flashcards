# Flashcards

An interactive flashcard learning app built with React, MUI, and a local Express server. Follows DDD clean architecture.

## Getting started locally

### 1. Install dependencies

```bash
npm install
```

### 2. Generate local data file

The app reads and writes to `flashcards-data.json` in the project root. This file is **gitignored** (your data stays local). Create it before running:

```base
npm run generate-data
```

### 3. Start the app

```bash
npm run dev
```

This starts both the Vite frontend (http://localhost:5173) and the Express file system API server (http://localhost:3001) concurrently.

## Architecture

```
src/
├── app/                 # Application shell — composes bounded contexts
│   ├── application/     # FlashcardsApp facade wiring all use cases
│   └── presentation/    # App, layouts, useFlashcardsApp hook
├── decks/               # Decks bounded context
│   ├── domain/          # Deck, Card, DeckId, CardId, DeckRepository (interface)
│   ├── application/     # Use cases: CreateDeck, AddCard, DeleteCard, etc.
│   ├── infrastructure/  # HttpDeckRepository — only file that knows about the API
│   └── presentation/    # React/MUI components
├── sessions/            # Study sessions bounded context
│   ├── domain/          # StudySession, CardResult, SessionId, StudySessionRepository
│   ├── application/     # Use cases: StartSession, RecordCardResult, CompleteSession
│   ├── infrastructure/  # HttpStudySessionRepository — only file that knows about the API
│   └── presentation/    # React/MUI components
└── shared/
    ├── infrastructure/  # ApiClient — wraps fetch, knows the server URL
    └── presentation/    # theme, shared UI tokens
```

**Swapping the backend:** replace `HttpDeckRepository`, `HttpStudySessionRepository`, and `ApiClient`. Domain and application layers are untouched.

## Running tests

```bash
npm test          # run once
npm run test:watch  # watch mode
npm run test:ui     # vitest UI
```

Tests cover all domain logic and use cases using in-memory repository fakes.

## General Notes from Tim

I built this as a quick and easy app to help me prepare for job interviews; hence why the infrastructure is kinda bootstrapped with a local Express API handling local file read/writes. I chose to go this way for quickness, but still wanted an oppurtunity to express (pardon the pun) my interest in DDD and Clean Architecture in the frontend.

I'm thinking of building a mobile app to offer and make more accessible to a wider audience. TBC.
