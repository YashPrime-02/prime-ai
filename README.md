# PRIME AI

> Your Personal AI Assistant built with Node.js, Commander, Clack, Ollama, and Qwen.

---

## Overview

PRIME AI is a terminal-based AI assistant designed to provide an interactive, extensible, and agent-driven experience directly from the command line.

The project is being built with a modular architecture so that new capabilities such as planning, autonomous agents, memory systems, tool execution, and external integrations can be added without major refactoring.

---

## Current Features

### CLI Foundation
- Commander-based CLI
- Interactive terminal menus using Clack
- Custom startup (Wakeup) screen
- ASCII banner with shadow effect
- Version and status display

### Agent Foundation
- Agent Orchestrator
- Action Tracker
- Tool Executor
- Approval Flow
- Diff Viewer
- Agent Tools Registry

### AI Infrastructure
- Ollama integration
- Local AI execution
- Qwen 2.5 (1.5B) model support
- Environment-based configuration
- AI service abstraction layer

### Configuration System
- `.env` support
- Centralized AI configuration
- Provider abstraction for future models

---

## Tech Stack

### Core Runtime
- Node.js

### CLI Framework
- Commander
- @clack/prompts

### AI
- Ollama
- Qwen 2.5 1.5B

### Validation
- Zod

### Terminal UI
- Chalk
- Figlet

### Utilities
- Diff

---

## Project Structure

```text
src
│
├── config
│   └── ai.config.js
│
├── services
│   └── ai.service.js
│
├── modes
│   ├── cli.js
│   │
│   └── agent
│       ├── agent.config.js
│       ├── action-tracker.js
│       ├── diff-view.js
│       ├── approval-flow.js
│       ├── agent-tools.js
│       ├── tool-executor.js
│       └── orchestrator.js
│
├── wakeup.js
│
└── index.js
│
.env
```

---

## Architecture

```text
User
 │
 ▼
Wakeup Screen
 │
 ▼
CLI Mode
 │
 ├── Agent Mode
 ├── Plan Mode
 └── Ask Mode
         │
         ▼
      AI Service
         │
         ▼
       Ollama
         │
         ▼
        Qwen
```

---

## Environment Variables

Create a `.env` file:

```env
AI_PROVIDER=ollama

OLLAMA_MODEL=qwen2.5:1.5b

OLLAMA_BASE_URL=http://localhost:11434
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd prime-ai
```

### Install Dependencies

```bash
npm install
```

### Install Ollama

Download:

https://ollama.com

### Pull Model

```bash
ollama pull qwen2.5:1.5b
```

### Run PRIME AI

```bash
npm start
```

or

```bash
prime-ai
```

---

## Current Development Status

### Completed

- CLI System
- Wakeup Module
- Mode Selection
- Environment Configuration
- Ollama Integration
- AI Service Layer
- Agent Foundation
- Approval Flow Foundation

### In Progress

- Agent Reasoning System
- AI Tool Calling
- Plan Mode
- Ask Mode

### Planned

- Memory System
- Telegram Integration
- Multi-Agent Workflows
- Autonomous Task Execution
- Project Generation Workflows

---

## Vision

PRIME AI aims to become a powerful local-first AI assistant capable of:

- Understanding project goals
- Planning implementations
- Modifying code safely
- Reviewing changes before execution
- Managing project memory
- Operating through multiple intelligent workflows

---

## Author

**Yash Mishra**

Built as a learning-focused AI engineering project to explore:

- Agent Architectures
- Local LLM Workflows
- Tool Calling Systems
- CLI Application Design
- AI-Assisted Development
