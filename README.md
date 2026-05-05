# Todo App - MEAN Stack

A modern, feature-rich Todo application built with the MEAN stack (MongoDB, Express, Angular, Node.js).

## Features

✨ **Complete Todo Management:**
- ✅ Create, Read, Update, Delete (CRUD) tasks
- 📋 Mark tasks as completed/pending
- ⏰ Due date tracking with visual indicators
- 🎯 Priority levels (Low, Medium, High)
- 🏷️ Category organization
- 📝 Task descriptions
- 🔍 Search functionality
- 🔄 Real-time filtering and sorting
- 📊 Task statistics (Total, Pending, Completed)
- 🗑️ Bulk delete completed tasks

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **MongoDB** - Database

### Frontend
- **Angular** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
MEAN_Practical/
├── backend/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/
│   │   └── Task.js        # Task schema
│   ├── routes/
│   │   └── tasks.js       # CRUD endpoints
│   ├── server.js          # Express server
│   └── package.json
├── UI/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── todo-list/
│   │   │   │   ├── todo-item/
│   │   │   │   └── todo-form/
│   │   │   ├── models/
│   │   │   │   └── task.model.ts
│   │   │   ├── services/
│   │   │   │   └── todo.service.ts
│   │   │   ├── app.ts
│   │   │   └── app.html
│   │   ├── main.ts
│   │   └── styles.css
│   └── package.json
```

## Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (running locally on port 27017 or update `MONGODB_URI`)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the UI directory:
```bash
cd UI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

The frontend will run on `http://localhost:4200`

## API Endpoints

### Base URL
`http://localhost:5000/api`

### Tasks Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (with optional filters) |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| PATCH | `/tasks/:id/toggle` | Toggle task completion status |

### Query Parameters (for GET /tasks)
- `completed` - Filter by completion status (true/false)
- `priority` - Filter by priority (low/medium/high)
- `category` - Filter by category
- `sortBy` - Sort tasks (createdAt/dueDate/priority)

### Example Requests

**Create a Task:**
```json
POST /api/tasks
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "high",
  "category": "Shopping",
  "dueDate": "2024-05-01"
}
```

**Update a Task:**
```json
PATCH /api/tasks/63f4a2c1b9d8e5f3a1c7b2d9
{
  "completed": true,
  "priority": "low"
}
```

**Get All Tasks with Filters:**
```
GET /api/tasks?completed=false&priority=high&sortBy=dueDate
```

## Task Model

```typescript
interface Task {
  _id?: string;
  title: string;              // Required, max 100 chars
  description?: string;       // Optional, max 500 chars
  completed: boolean;         // Default: false
  priority: 'low' | 'medium' | 'high';  // Default: 'medium'
  dueDate?: Date;            // Optional
  category: string;          // Default: 'General'
  createdAt?: Date;          // Auto-generated
  updatedAt?: Date;          // Auto-generated
}
```

## Environment Variables

### Backend
Create a `.env` file in the backend directory (optional):
```
MONGODB_URI=mongodb://localhost:27017/todo-app
PORT=5000
```

### Frontend
The frontend is configured to use `http://localhost:5000` by default.

## Features Guide

### Adding a Task
1. Click the "+ Add New Task" button
2. Fill in the task details
3. Select priority and category
4. Set an optional due date
5. Click "Add Task"

### Filtering Tasks
- **Status**: View all, pending, or completed tasks
- **Priority**: Filter by Low, Medium, or High
- **Category**: Filter by task category
- **Search**: Search by title or description

### Sorting Tasks
- **Newest First**: Sort by creation date
- **Due Date**: Sort by due date
- **Priority**: Sort by priority level

### Task Indicators
- 🔴 Red border: High priority
- 🟡 Yellow border: Medium priority
- 🟢 Green border: Low priority
- ⏰ Due Soon: Task due within 3 days
- 🔔 Due Today: Task due today
- ⚠️ Overdue: Task past due date

### Statistics
- **Total**: All tasks in the list
- **Pending**: Incomplete tasks
- **Completed**: Finished tasks

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running on your machine
- Check `MONGODB_URI` in `backend/config/db.js`
- Verify the connection string format

**Port 5000 already in use:**
```bash
# Change PORT in backend/server.js or use:
PORT=3001 npm start
```

### Frontend Issues

**CORS Errors:**
- Ensure backend is running on port 5000
- Check backend CORS configuration in `server.js`

**Cannot find module errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Angular compilation errors:**
```bash
# Update Angular CLI
npm install -g @angular/cli@latest
```

## Development Tips

### Hot Reload
- **Backend**: Restart manually or use `nodemon` package
- **Frontend**: Automatic with `ng serve`

### Debugging
- Use Angular DevTools browser extension
- Check browser console for frontend errors
- Check server logs for backend errors

### Database Management
- Use MongoDB Compass or Studio3T for database inspection
- Documents are stored in `todo-app.tasks` collection

## Performance Considerations

- Tasks are paginated/sorted on the backend
- Search is performed on the frontend for better UX
- Dates are stored in ISO 8601 format
- Indexes are recommended on `completed`, `priority`, `category`

## Future Enhancements

- 👥 User authentication
- 💾 Task export/import
- 🔔 Reminders and notifications
- 📱 Mobile app version
- 🗂️ Task subtasks
- 🏷️ Custom tags
- 🎨 Theme customization
- 📈 Task analytics
- 🔗 Task dependencies

## License

ISC

## Support

For issues or questions, please create an issue in the repository.

---

**Happy Task Managing! 🚀**
