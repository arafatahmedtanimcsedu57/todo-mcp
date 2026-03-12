# Todo MCP Server — Documentation

A learning guide for junior engineers on how this MCP server works, why it exists, and how to extend it.

---

## Table of Contents

1. [What is MCP?](#1-what-is-mcp)
2. [Why do we need an MCP Server?](#2-why-do-we-need-an-mcp-server)
3. [How it fits into the project](#3-how-it-fits-into-the-project)
4. [Architecture diagram](#4-architecture-diagram)
5. [Project structure](#5-project-structure)
6. [How the server starts](#6-how-the-server-starts)
7. [Tools (the core concept)](#7-tools-the-core-concept)
8. [Resources](#8-resources)
9. [The API client layer](#9-the-api-client-layer)
10. [Configuration (.mcp.json)](#10-configuration-mcpjson)
11. [Transport: stdio vs HTTP](#11-transport-stdio-vs-http)
12. [How Claude decides which tool to call](#12-how-claude-decides-which-tool-to-call)
13. [Adding a new tool (step-by-step)](#13-adding-a-new-tool-step-by-step)
14. [Build and run](#14-build-and-run)
15. [Common questions](#15-common-questions)

---

## 1. What is MCP?

**MCP = Model Context Protocol.**

It is an open standard created by Anthropic that lets AI assistants (like Claude) talk to external tools and data sources in a structured, safe way.

Think of it like a **plugin system for AI**:

```
Without MCP:  Claude only knows what you type to it.
With MCP:     Claude can also call tools you define — read a database,
              call an API, run a script — and use the results in its response.
```

MCP defines:
- How the AI (client) discovers what tools are available
- How the AI calls a tool with arguments
- How the tool returns results back to the AI

---

## 2. Why do we need an MCP Server?

Our project has a NestJS REST API that manages todos. Without MCP, Claude cannot interact with that data — it would have no way to know what todos exist or create new ones.

The MCP server acts as a **bridge**:

```
Claude  →  MCP Server  →  NestJS REST API  →  Database
```

By writing an MCP server, we give Claude the ability to:
- List all todos
- Create a new todo
- Update a todo (mark complete, change title, set due date)
- Delete a todo

...just by asking in plain English.

---

## 3. How it fits into the project

```
todo-list/
├── frontend/          React app — talks to backend over HTTP
├── backend/           NestJS REST API — manages todos in DB
├── mcp-server/        ← YOU ARE HERE — bridges Claude ↔ backend
└── .mcp.json          Config that tells Claude Code where the MCP server is
```

The frontend and the MCP server are **two independent clients** of the same backend. They don't know about each other.

---

## 4. Architecture diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        YOU (the user)                       │
│                 "Show me my pending todos"                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ natural language
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 CLAUDE CODE  (MCP Client)                    │
│                                                             │
│  1. Reads .mcp.json on startup                              │
│  2. Spawns mcp-server as a child process                    │
│  3. Discovers available tools over stdio                    │
│  4. Decides to call list_todos()                            │
│  5. Receives all todos, filters pending ones, responds      │
└──────────────────────────┬──────────────────────────────────┘
                           │ JSON-RPC over stdin/stdout
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              MCP SERVER  (mcp-server/src/index.ts)          │
│                                                             │
│  Exposes tools:  list_todos, create_todo,                   │
│                  update_todo, delete_todo                   │
│  Exposes resource: todo://list                              │
│                                                             │
│  When a tool is called → delegates to api-client.ts         │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP fetch (GET / POST / PATCH / DELETE)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           NESTJS BACKEND  (backend/)  — port 3000           │
│                                                             │
│  GET    /todos        list all todos                        │
│  POST   /todos        create todo                           │
│  PATCH  /todos/:id    update todo                           │
│  DELETE /todos/:id    delete todo                           │
└─────────────────────────────────────────────────────────────┘
```

**Key point:** Claude Code spawns the MCP server once per session. The same process handles every question — no new server is created per request.

---

## 5. Project structure

```
mcp-server/
├── src/
│   ├── index.ts        Main entry — creates McpServer, registers tools
│   ├── api-client.ts   HTTP functions that call the NestJS backend
│   └── types.ts        Shared TypeScript interfaces (Todo, inputs)
├── package.json
└── tsconfig.json
```

### `types.ts` — shared data shapes

```ts
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

interface CreateTodoInput { title: string; due_date?: string; }
interface UpdateTodoInput { title?: string; completed?: boolean; due_date?: string | null; }
```

### `api-client.ts` — HTTP layer

Thin wrapper around `fetch()`. Each function maps to one REST endpoint:

| Function       | HTTP call                    |
|----------------|------------------------------|
| `listTodos()`  | GET /todos                   |
| `createTodo()` | POST /todos                  |
| `updateTodo()` | PATCH /todos/:id             |
| `deleteTodo()` | DELETE /todos/:id            |

The base URL comes from the `API_BASE_URL` environment variable (set in `.mcp.json`).

### `index.ts` — MCP server

Creates an `McpServer` instance, registers tools and resources, then connects to stdio transport. This is the file Claude Code talks to.

---

## 6. How the server starts

```ts
// 1. Create the server
const server = new McpServer({ name: 'todo-mcp', version: '1.0.0' });

// 2. Register tools (see section 7)
server.tool('list_todos', ...);
server.tool('create_todo', ...);

// 3. Connect to stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
```

Once `server.connect(transport)` is called, the process stays alive and listens for incoming JSON-RPC messages on `stdin`. It writes responses to `stdout`.

---

## 7. Tools (the core concept)

A **tool** is a function that Claude can call. You register it with:

```ts
server.tool(
  'tool_name',           // name Claude uses to call it
  'description',         // Claude reads this to know WHEN to use the tool
  { /* zod schema */ },  // input parameters with types and descriptions
  async (params) => {    // handler — runs when Claude calls the tool
    // do work...
    return {
      content: [{ type: 'text', text: 'result as string' }]
    };
  }
);
```

### The 4 tools in this server

#### `list_todos`
```ts
server.tool('list_todos', 'List all todos...', {}, async () => {
  const todos = await listTodos();
  return { content: [{ type: 'text', text: JSON.stringify(todos) }] };
});
```
No input parameters. Returns all todos as JSON text.

---

#### `create_todo`
```ts
server.tool('create_todo', 'Create a new todo item.', {
  title:    z.string().describe('The title/description of the todo'),
  due_date: z.string().optional().describe('ISO 8601 date e.g. "2025-12-31"'),
}, async ({ title, due_date }) => {
  const todo = await createTodo({ title, due_date });
  return { content: [{ type: 'text', text: JSON.stringify(todo) }] };
});
```
Takes `title` (required) and `due_date` (optional). Returns the created todo.

---

#### `update_todo`
```ts
server.tool('update_todo', 'Update an existing todo...', {
  id:        z.number().describe('The ID of the todo'),
  title:     z.string().optional(),
  completed: z.boolean().optional(),
  due_date:  z.string().nullable().optional(),
}, async ({ id, title, completed, due_date }) => {
  const todo = await updateTodo(id, { title, completed, due_date });
  return { content: [{ type: 'text', text: JSON.stringify(todo) }] };
});
```
All fields except `id` are optional — only pass what you want to change.

---

#### `delete_todo`
```ts
server.tool('delete_todo', 'Permanently delete a todo item.', {
  id: z.number().describe('The ID of the todo to delete'),
}, async ({ id }) => {
  await deleteTodo(id);
  return { content: [{ type: 'text', text: `Todo ${id} deleted.` }] };
});
```

---

### How tool descriptions affect Claude

The description string is **critical**. Claude reads it to decide whether to call the tool. Be specific:

| Vague (bad)               | Specific (good)                                          |
|---------------------------|----------------------------------------------------------|
| `'Get todos'`             | `'List all todos, sorted by creation date newest first'` |
| `'Change a todo'`         | `'Update title, completion status, or due date of a todo by ID'` |

---

### Error handling pattern

Every tool wraps its logic in try/catch and returns `isError: true` on failure:

```ts
try {
  const result = await someApiCall();
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
} catch (err) {
  return {
    isError: true,
    content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
  };
}
```

This tells Claude the tool failed so it can respond appropriately instead of using bad data.

---

## 8. Resources

A **resource** is read-only data Claude can access (like a file or feed). Unlike tools, resources aren't called with arguments — they're fetched by URI.

```ts
server.resource(
  'todo-list',          // resource name
  'todo://list',        // URI Claude uses to read it
  { mimeType: 'application/json', description: 'All todos as JSON' },
  async () => {
    const todos = await listTodos();
    return {
      contents: [{ uri: 'todo://list', mimeType: 'application/json', text: JSON.stringify(todos) }]
    };
  }
);
```

**Tools vs Resources:**

| | Tool | Resource |
|---|---|---|
| Has input params | Yes | No |
| Can write/mutate | Yes | No (read-only) |
| Use case | Actions | Static/live data feeds |

---

## 9. The API client layer

`api-client.ts` keeps all HTTP logic separate from MCP logic. This is intentional — if you ever want to swap the backend (e.g. use GraphQL instead of REST), you only change this file.

```ts
const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

export async function listTodos(): Promise<Todo[]> {
  const res = await fetch(`${BASE_URL}/todos`);
  if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
  return res.json();
}
```

Note: it uses Node's built-in `fetch` (available since Node 18). No axios needed here because the MCP server runs in Node, not a browser.

---

## 10. Configuration (.mcp.json)

This file lives at the project root and tells Claude Code how to start the MCP server:

```json
{
  "mcpServers": {
    "todo-mcp": {
      "command": "node",
      "args": ["mcp-server/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

| Field       | Purpose                                              |
|-------------|------------------------------------------------------|
| `command`   | Executable to run (`node`)                           |
| `args`      | Arguments — path to the compiled JS entry file       |
| `env`       | Environment variables injected into the server process |

> **Important:** `.mcp.json` is project-scoped. It only applies when Claude Code is opened in this directory.

---

## 11. Transport: stdio vs HTTP

MCP supports two transports. This server uses **stdio**.

```
stdio transport:
  Claude Code spawns the server as a child process.
  They communicate through stdin (input) and stdout (output).
  Messages are newline-delimited JSON-RPC 2.0 objects.

  Pros: Zero config, no ports, works offline, secure (no network exposure)
  Cons: Only works locally (same machine)

HTTP/SSE transport:
  The MCP server runs as a standalone web server.
  Claude connects to it over the network.

  Pros: Can run on a remote machine, multiple clients can connect
  Cons: Needs a port, firewall config, auth setup
```

For local developer tools like this one, **stdio is the right choice**.

---

## 12. How Claude decides which tool to call

Claude does not randomly pick tools. It follows this reasoning process:

```
User says: "Mark todo 5 as done"
                │
                ▼
Claude reads all tool descriptions it knows about:
  - list_todos:   "List all todos..."
  - create_todo:  "Create a new todo..."
  - update_todo:  "Update an existing todo. Use this to change title,
                   mark as completed/incomplete, or set a due date."  ← MATCH
  - delete_todo:  "Permanently delete a todo..."
                │
                ▼
Claude calls: update_todo({ id: 5, completed: true })
                │
                ▼
MCP server calls: PATCH /todos/5  { completed: true }
                │
                ▼
Claude responds: "Done! Todo 5 has been marked as complete."
```

If no tool matches, Claude answers from its own knowledge without calling any tool.

---

## 13. Adding a new tool (step-by-step)

Let's say you want to add a tool that marks **all** todos as complete.

### Step 1 — Add the HTTP function in `api-client.ts`

```ts
export async function completeAllTodos(): Promise<void> {
  const todos = await listTodos();
  await Promise.all(
    todos.filter(t => !t.completed).map(t =>
      fetch(`${BASE_URL}/todos/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      })
    )
  );
}
```

### Step 2 — Register the tool in `index.ts`

```ts
import { completeAllTodos } from './api-client.js';

server.tool(
  'complete_all_todos',
  'Mark every incomplete todo as completed.',
  {},
  async () => {
    try {
      await completeAllTodos();
      return { content: [{ type: 'text', text: 'All todos marked as complete.' }] };
    } catch (err) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${(err as Error).message}` }] };
    }
  }
);
```

### Step 3 — Build and restart

```bash
cd mcp-server
npm run build
# Restart Claude Code to reload the server
```

---

## 14. Build and run

### Prerequisites
- Node.js 18+
- The NestJS backend must be running on port 3000

### Build
```bash
cd mcp-server
npm install
npm run build        # compiles TypeScript → dist/
```

### Run manually (for testing)
```bash
node dist/index.js
# Server is now waiting for JSON-RPC messages on stdin
# Press Ctrl+C to stop
```

### Used by Claude Code
Claude Code starts it automatically via `.mcp.json`. You don't need to run it manually during normal use.

### Watch mode (during development)
```bash
npm run dev          # tsc --watch — recompiles on file save
```

---

## 15. Common questions

**Q: Do I need to restart Claude Code after changing the MCP server?**
Yes. Claude Code spawns the server once at startup. After rebuilding (`npm run build`), restart Claude Code to pick up the changes.

---

**Q: The tool isn't being called even though I asked for it. Why?**
Check the tool's description string. Claude uses it to decide when to call the tool. Make the description more specific and match the kind of language a user would use.

---

**Q: Can I add a tool that doesn't call the backend?**
Yes. A tool can do anything — read a file, call a third-party API, do a calculation. The api-client pattern is just a convention we use here.

---

**Q: What's the difference between a tool and a prompt?**
- **Tool** — Claude calls it when it needs data or to take an action (runtime)
- **Prompt** — a pre-written template Claude can use to structure a conversation (design time)
- **Resource** — read-only data Claude can access by URI

---

**Q: Can Claude call multiple tools in one response?**
Yes. If you ask "create a todo and then show me all todos", Claude may call `create_todo` and then `list_todos` sequentially in a single response turn.

---

**Q: What if the backend is down?**
The api-client functions throw an error, the tool catches it, returns `isError: true`, and Claude will tell you the backend is unreachable instead of crashing silently.
