# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Start MongoDB
```bash
# Make sure MongoDB is running (usually runs on localhost:27017)
mongod
```

### Step 2: Start Backend Server
```bash
cd backend
npm install  # Only needed first time
npm start    # Server runs on port 5000
```

### Step 3: Start Frontend (in a new terminal)
```bash
cd UI
npm install  # Only needed first time
ng serve     # App opens on http://localhost:4200
```

### Step 4: Open in Browser
Navigate to `http://localhost:4200`

---

## 📋 Available Options in Todo App

### Creating a Task
- **Title** - Task name (required)
- **Description** - Additional details about the task
- **Priority** - Low, Medium, or High
- **Category** - Organize tasks by category
- **Due Date** - Set deadline for the task

### Managing Tasks
- ✅ **Toggle Complete** - Click checkbox to mark as done
- ✏️ **Edit** - Click pencil icon to modify
- 🗑️ **Delete** - Click trash icon to remove
- 🔍 **Search** - Search by title or description

### Filtering & Sorting
- **Status Filter** - All/Pending/Completed
- **Priority Filter** - Low/Medium/High
- **Category Filter** - Filter by category
- **Sort Options** - Newest First / Due Date / Priority

### View Statistics
- **Total Tasks** - Count of all tasks
- **Pending** - Count of incomplete tasks
- **Completed** - Count of finished tasks

---

## 🎯 Task Features

### Priority Indicators
- 🔴 **High** - Red color
- 🟡 **Medium** - Yellow color
- 🟢 **Low** - Green color

### Due Date Status
- ⏰ **Due Soon** - Yellow (within 3 days)
- 🔔 **Due Today** - Blue (today)
- ⚠️ **Overdue** - Red (past due)

### Bulk Operations
- 🗑️ **Clear Completed** - Remove all finished tasks at once

---

## 🔌 API Quick Reference

### Get All Tasks
```bash
curl http://localhost:5000/api/tasks
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "priority": "high",
    "category": "Work",
    "dueDate": "2024-05-01"
  }'
```

### Update Task
```bash
curl -X PATCH http://localhost:5000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/{id}
```

### Toggle Task
```bash
curl -X PATCH http://localhost:5000/api/tasks/{id}/toggle
```

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to MongoDB | Make sure `mongod` is running |
| Port 5000 already in use | Kill the process: `lsof -ti:5000 \| xargs kill` |
| CORS errors | Ensure backend is on port 5000 |
| Angular won't compile | Run `npm install` in UI folder |
| Task not showing | Check MongoDB is connected and running |

---

## 📁 Important Files

- Backend server: `backend/server.js`
- Database config: `backend/config/db.js`
- Task model: `backend/models/Task.js`
- API routes: `backend/routes/tasks.js`
- Todo service: `UI/src/app/services/todo.service.ts`
- Todo component: `UI/src/app/components/todo-list/`

---

**Ready to manage your tasks? Let's go! 🎉**
