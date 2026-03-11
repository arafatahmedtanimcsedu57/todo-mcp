# Requirements

## 1. Todo Management

- As a user, I can create a new todo with a title
- As a user, I can create a todo with an optional due date
- As a user, I can mark a todo as completed
- As a user, I can unmark a completed todo
- As a user, I can delete a todo
- As a user, I can see all my todos sorted by creation date (newest first)

## 2. Due Date & Status Tracking

- As a user, I can see a "Done" stamp on completed todos
- As a user, I can see a "Failed" stamp on overdue (past due date) todos
- As a user, I can see the due date displayed on active todos
- As a user, I can clear a due date when adding a todo

## 3. User Interface

- As a user, I see a notebook-style design with paper textures and margin lines
- As a user, I see today's date displayed at the top
- As a user, I see a count of my todos
- As a user, I see smooth slide-in animations when todos appear
- As a user, I see completed todos with strikethrough text
- As a user, I see color-coded statuses (green=done, red=failed, blue=due date)
- As a user, I see an "— no entries yet —" message when there are no todos

## 4. Data Validation & Error Handling

- As a user, I cannot create a todo with an empty title
- As a user, I see an error message if the backend is unreachable
- As a user, I get a 404 error if I try to update/delete a non-existent todo

## 5. Backend API

- As a developer, I have REST endpoints: GET /todos, POST /todos, PATCH /todos/:id, DELETE /todos/:id
- As a developer, I have a health check endpoint at GET /
- As a developer, I have DTO validation with class-validator on all inputs

## 6. Data Model

- Todo entity: id (auto PK), title (string), completed (boolean, default false), due_date (nullable date), created_at (auto timestamp)

## 7. Database & Seeding

- As a developer, I can run `npm run seed` to populate the database with 8 sample todos
- As a developer, the database auto-syncs schema via TypeORM

## 8. Infrastructure & DevOps

- As a developer, I can run the full stack with `docker compose up` (PostgreSQL, backend, frontend)
- As a developer, I get hot reload on the frontend during development
- As a developer, I can run unit tests, e2e tests, lint, and format via npm scripts
