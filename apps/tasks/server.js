#!/usr/bin/env node

import Fastify from 'fastify';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import Database from 'better-sqlite3';
import vine from '@vinejs/vine';

const __dirname = dirname(new URL(import.meta.url).pathname);

const fastify = Fastify({
  logger: true,
});

// Initialize SQLite database
const db = new Database(join(__dirname, 'tasks.db'));

// Create tasks table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    notes TEXT,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    dueDate TEXT,
    completed BOOLEAN NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

// Security headers
fastify.addHook('onSend', async (request, reply) => {
  reply.headers({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy':
      "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'",
  });
});

// Validation schemas
const taskSchema = vine.object({
  title: vine.string().trim().minLength(1).maxLength(100),
  notes: vine.string().trim().maxLength(500).optional(),
  priority: vine.enum(['low', 'medium', 'high']),
  dueDate: vine.string().optional().nullable(),
  completed: vine.boolean().optional(),
});

const updateTaskSchema = vine.object({
  title: vine.string().trim().minLength(1).maxLength(100).optional(),
  notes: vine.string().trim().maxLength(500).optional(),
  priority: vine.enum(['low', 'medium', 'high']).optional(),
  dueDate: vine.string().optional().nullable(),
  completed: vine.boolean().optional(),
});

const completeTaskSchema = vine.object({
  completed: vine.boolean(),
});

// Serve static files
fastify.register(import('@fastify/static'), {
  root: __dirname,
  prefix: '/',
});

// Route for the home page
fastify.get('/', async (request, reply) => {
  const html = readFileSync(join(__dirname, 'index.html'), 'utf8');
  reply.type('text/html').send(html);
});

// Get all tasks
fastify.get('/api/tasks', async (request, reply) => {
  try {
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC');
    const tasks = stmt.all();
    
    // Convert SQLite boolean integers to JavaScript booleans
    const formattedTasks = tasks.map(task => ({
      ...task,
      completed: Boolean(task.completed),
    }));
    
    reply.send(formattedTasks);
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({
      error: 'Database Error',
      message: 'Failed to retrieve tasks',
    });
  }
});

// Create a new task
fastify.post('/api/tasks', async (request, reply) => {
  try {
    const validatedData = await vine.validate({
      schema: taskSchema,
      data: request.body,
    });

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO tasks (title, notes, priority, dueDate, completed, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      validatedData.title,
      validatedData.notes || null,
      validatedData.priority,
      validatedData.dueDate || null,
      validatedData.completed || false,
      now,
      now
    );

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    
    reply.status(201).send({
      ...newTask,
      completed: Boolean(newTask.completed),
    });
  } catch (error) {
    fastify.log.error(error);

    if (error.messages) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Invalid task data',
        details: error.messages,
      });
    }

    reply.status(500).send({
      error: 'Database Error',
      message: 'Failed to create task',
    });
  }
});

// Update a task
fastify.put('/api/tasks/:id', async (request, reply) => {
  try {
    const taskId = parseInt(request.params.id, 10);
    
    if (isNaN(taskId)) {
      return reply.status(400).send({
        error: 'Invalid ID',
        message: 'Task ID must be a number',
      });
    }

    const validatedData = await vine.validate({
      schema: updateTaskSchema,
      data: request.body,
    });

    // Check if task exists
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!existingTask) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    
    if (validatedData.title !== undefined) {
      updates.push('title = ?');
      values.push(validatedData.title);
    }
    if (validatedData.notes !== undefined) {
      updates.push('notes = ?');
      values.push(validatedData.notes || null);
    }
    if (validatedData.priority !== undefined) {
      updates.push('priority = ?');
      values.push(validatedData.priority);
    }
    if (validatedData.dueDate !== undefined) {
      updates.push('dueDate = ?');
      values.push(validatedData.dueDate || null);
    }
    if (validatedData.completed !== undefined) {
      updates.push('completed = ?');
      values.push(validatedData.completed);
    }

    if (updates.length === 0) {
      return reply.status(400).send({
        error: 'No Updates',
        message: 'No valid fields provided for update',
      });
    }

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(taskId);

    const stmt = db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    
    reply.send({
      ...updatedTask,
      completed: Boolean(updatedTask.completed),
    });
  } catch (error) {
    fastify.log.error(error);

    if (error.messages) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Invalid task data',
        details: error.messages,
      });
    }

    reply.status(500).send({
      error: 'Database Error',
      message: 'Failed to update task',
    });
  }
});

// Toggle task completion
fastify.patch('/api/tasks/:id/complete', async (request, reply) => {
  try {
    const taskId = parseInt(request.params.id, 10);
    
    if (isNaN(taskId)) {
      return reply.status(400).send({
        error: 'Invalid ID',
        message: 'Task ID must be a number',
      });
    }

    const validatedData = await vine.validate({
      schema: completeTaskSchema,
      data: request.body,
    });

    // Check if task exists
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!existingTask) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    const stmt = db.prepare('UPDATE tasks SET completed = ?, updatedAt = ? WHERE id = ?');
    stmt.run(validatedData.completed, new Date().toISOString(), taskId);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    
    reply.send({
      ...updatedTask,
      completed: Boolean(updatedTask.completed),
    });
  } catch (error) {
    fastify.log.error(error);

    if (error.messages) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Invalid completion data',
        details: error.messages,
      });
    }

    reply.status(500).send({
      error: 'Database Error',
      message: 'Failed to update task completion',
    });
  }
});

// Delete a task
fastify.delete('/api/tasks/:id', async (request, reply) => {
  try {
    const taskId = parseInt(request.params.id, 10);
    
    if (isNaN(taskId)) {
      return reply.status(400).send({
        error: 'Invalid ID',
        message: 'Task ID must be a number',
      });
    }

    // Check if task exists
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!existingTask) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(taskId);

    reply.status(204).send();
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({
      error: 'Database Error',
      message: 'Failed to delete task',
    });
  }
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  reply.send({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  fastify.log.info('Shutting down gracefully...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  fastify.log.info('Shutting down gracefully...');
  db.close();
  process.exit(0);
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3002', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`Tasks app running at http://localhost:${port}`);
    console.log('SQLite database initialized at tasks.db');
  } catch (err) {
    fastify.log.error(err);
    db.close();
    process.exit(1);
  }
};

start();