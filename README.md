# PRIME AI

> A Local-First AI Coding Assistant powered by Ollama, Qwen, Node.js, and Agent Workflows.

---

# Overview

PRIME AI is a terminal-based AI assistant designed to evolve into a full coding agent capable of:

* Understanding project structure
* Reading and analyzing source code
* Planning implementations
* Generating code
* Modifying files safely
* Requesting approval before applying changes
* Operating completely with local LLMs

The project is built with a modular architecture inspired by modern AI coding tools such as Cursor, OpenCode, Claude Code, and Codex.

Current development focuses on building the agent foundation before introducing autonomous code generation and multi-step reasoning.

---

# Current Features

## CLI Foundation

* Commander-based CLI
* Interactive menus using Clack
* Wakeup screen
* ASCII startup banner
* Mode selection system
* Version display
* Status monitoring

---

## AI Infrastructure

* Ollama Integration
* Local AI Execution
* Qwen 2.5 (1.5B) Support
* Environment Variable Configuration
* AI Service Abstraction Layer
* Request Timeout Protection
* Error Handling
* Provider-Based Architecture

---

## Agent Foundation

### Agent Orchestrator

Responsible for:

* Goal intake
* Context initialization
* Tool initialization
* AI coordination

### Action Tracker

Tracks staged operations:

* File Creation
* File Modification
* File Deletion
* Folder Creation
* Tool Execution

### Tool Executor

Provides secure filesystem operations:

* Safe path resolution
* Path traversal protection
* Workspace restrictions
* File discovery
* File reading

### Approval Flow

Future mutations are staged before execution.

Supports:

* Approve All
* Reject All
* Review Changes Individually

---

## File Intelligence System

PRIME AI can now:

### Detect File References

Examples:

```text
tell me about index.js

explain package.json

review orchestrator.js
```

### Search Workspace

Automatically locates files across the project.

Example:

```text
src/index.js
src/modes/agent/orchestrator.js
package.json
README.md
```

### Read Project Files

Reads source files safely with:

* Size limits
* Extension validation
* Workspace protection

### Explain Source Code

PRIME AI sends actual source code to the model and receives explanations including:

* File purpose
* Important imports
* Key functions
* Architecture role
* Potential improvements

---

# Tech Stack

## Runtime

* Node.js

## CLI

* Commander
* @clack/prompts

## AI

* Ollama
* Qwen 2.5 (1.5B)

## Validation

* Zod

## Terminal UI

* Chalk
* Figlet

## Utilities

* Diff

---

# Project Structure

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
│   │
│   ├── cli.js
│   │
│   └── agent
│       │
│       ├── agent.config.js
│       ├── action-tracker.js
│       ├── approval-flow.js
│       ├── diff-view.js
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

# Architecture

Current Architecture

```text
User
 │
 ▼
Wakeup Screen
 │
 ▼
CLI Mode
 │
 ▼
Agent Mode
 │
 ▼
Goal Processing
 │
 ▼
File Detection
 │
 ▼
Workspace Search
 │
 ▼
File Reading
 │
 ▼
AI Service
 │
 ▼
Ollama
 │
 ▼
Qwen 2.5
 │
 ▼
Code Explanation
```

---

# Environment Variables

Create a .env file:

```env
AI_PROVIDER=ollama

OLLAMA_MODEL=qwen2.5:1.5b

OLLAMA_BASE_URL=http://localhost:11434
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd prime-ai
```

## Install Dependencies

```bash
npm install
```

## Install Ollama

Download:

https://ollama.com

---

## Pull Model

```bash
ollama pull qwen2.5:1.5b
```

---

## Verify Ollama

```bash
ollama list
```

Expected:

```text
qwen2.5:1.5b
```

---

## Run PRIME AI

```bash
npm start
```

or

```bash
prime-ai
```

---

# Example Usage

## Explain a File

```text
tell me about index.js
```

Agent Flow:

```text
Locate File
↓
Read Source Code
↓
Send Context to AI
↓
Generate Explanation
```

---

## Analyze Project File

```text
explain orchestrator.js
```

Output Includes:

* File purpose
* Imports
* Functions
* Architecture role
* Suggestions

---

# Development Status

## Completed

### Phase 1

* CLI Foundation
* Wakeup Screen
* Navigation System
* Mode Selection

### Phase 2

* Ollama Integration
* Qwen Integration
* AI Service Layer
* Environment Configuration

### Phase 3

* Agent Foundation
* Action Tracking
* Tool Executor
* Approval System

### Phase 4

* File Detection
* Workspace Search
* File Reading
* Code Explanation

---

## In Progress

* Agent Reasoning Engine
* Tool Calling
* Project Analysis
* Plan Mode
* Ask Mode

---

## Planned

### Coding Agent

* Create Files
* Modify Files
* Delete Files
* Create Folders

### Agent Intelligence

* Multi-Step Reasoning
* Tool Loop Execution
* Autonomous Planning
* Context Memory

### Integrations

* Telegram
* Discord
* GitHub

### Advanced Features

* Multi-Agent Workflows
* Project Scaffolding
* Automated Refactoring
* Test Generation

---

# Current Progress

```text
Overall Project      ████████████░░░░░░░░ 60%

Agent Foundation     ████████████████░░░░ 80%

Coding Agent         ██████░░░░░░░░░░░░░░ 30%
```

---

# Vision

PRIME AI aims to become a local-first AI engineering assistant capable of:

* Understanding software projects
* Reading entire codebases
* Generating production-ready code
* Safely applying modifications
* Managing long-term project memory
* Operating through autonomous workflows

All while running locally through Ollama-powered models.

---

# Author

**Yash Mishra**

Built as a hands-on AI engineering project focused on:

* Agent Architectures
* Local LLM Systems
* Tool Calling
* AI Coding Agents
* CLI Application Design
* Autonomous Workflows
