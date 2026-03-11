/// <reference types="node" />
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { listTodos, createTodo, updateTodo, deleteTodo } from './api-client.js';

const server = new McpServer({
  name: 'todo-mcp',
  version: '1.0.0',
});

// --- Tools ---

server.tool(
  'list_todos',
  'List all todos. Returns an array of todos sorted by creation date (newest first).',
  {},
  async () => {
    try {
      const todos = await listTodos();
      return {
        content: [{ type: 'text', text: JSON.stringify(todos, null, 2) }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
      };
    }
  },
);

server.tool(
  'create_todo',
  'Create a new todo item.',
  {
    title: z.string().describe('The title/description of the todo item'),
    due_date: z
      .string()
      .optional()
      .describe('Optional due date in ISO 8601 format (e.g. "2025-12-31")'),
  },
  async ({ title, due_date }) => {
    try {
      const todo = await createTodo({ title, due_date });
      return {
        content: [{ type: 'text', text: JSON.stringify(todo, null, 2) }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
      };
    }
  },
);

server.tool(
  'update_todo',
  'Update an existing todo. Use this to change the title, mark as completed/incomplete, or set a due date.',
  {
    id: z.number().describe('The ID of the todo to update'),
    title: z.string().optional().describe('New title for the todo'),
    completed: z.boolean().optional().describe('Set to true to mark as done, false to mark as incomplete'),
    due_date: z
      .string()
      .nullable()
      .optional()
      .describe('New due date in ISO 8601 format, or null to remove the due date'),
  },
  async ({ id, title, completed, due_date }) => {
    try {
      const input: Record<string, unknown> = {};
      if (title !== undefined) input.title = title;
      if (completed !== undefined) input.completed = completed;
      if (due_date !== undefined) input.due_date = due_date;

      const todo = await updateTodo(id, input);
      return {
        content: [{ type: 'text', text: JSON.stringify(todo, null, 2) }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
      };
    }
  },
);

server.tool(
  'delete_todo',
  'Permanently delete a todo item.',
  {
    id: z.number().describe('The ID of the todo to delete'),
  },
  async ({ id }) => {
    try {
      await deleteTodo(id);
      return {
        content: [{ type: 'text', text: `Todo ${id} deleted successfully.` }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
      };
    }
  },
);

// --- Resource ---

server.resource(
  'todo-list',
  'todo://list',
  { mimeType: 'application/json', description: 'All todos as JSON array' },
  async () => {
    const todos = await listTodos();
    return {
      contents: [
        {
          uri: 'todo://list',
          mimeType: 'application/json',
          text: JSON.stringify(todos, null, 2),
        },
      ],
    };
  },
);

// --- Start ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('todo-mcp server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
