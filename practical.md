# MEAN Stack Practical File

## Project Title
Authenticated Todo Management Application using MongoDB, Express, Angular, and Node.js

## Project Overview
This project is a MEAN stack practical application in which:
- MongoDB stores users and todo tasks
- Express and Node.js provide REST APIs
- Mongoose defines data models and connects the backend to MongoDB
- Angular builds the single-page frontend
- Login and registration are used to authenticate users before accessing todos

---

## Practical 4
## To Install MongoDB and Create a New Document/Database using CRUD Operations like Insert, Update, Read and Delete

### Aim
To install MongoDB, create a database for the todo application, and perform CRUD operations on task documents.

### Required Theory
MongoDB is a NoSQL document database. Data is stored in BSON-like documents inside collections.  
In this project:
- Database name: `todo-app`
- Collections used: `users`, `tasks`
- CRUD means:
  - `Create`: insert a new document
  - `Read`: fetch existing documents
  - `Update`: modify an existing document
  - `Delete`: remove an existing document

### Commands Used
```bash
# Install MongoDB on Ubuntu
sudo apt update
sudo apt install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Check status
sudo systemctl status mongodb

# Open Mongo shell
mongosh
```

### Create Database and Use It
```js
use todo-app
```

### Basic MongoDB CRUD Commands
```js
db.tasks.insertOne({
  title: "Complete MEAN practical",
  description: "Write report and screenshots",
  completed: false,
  priority: "high",
  category: "College"
})

db.tasks.find()

db.tasks.updateOne(
  { title: "Complete MEAN practical" },
  { $set: { completed: true } }
)

db.tasks.deleteOne({ title: "Complete MEAN practical" })
```

### How CRUD Appears in This Project
The backend route file performs CRUD through Express APIs.

#### Important Code Snippet
From `backend/routes/tasks.js`
```js
router.post('/', async (req, res) => {
  const task = new Task({
    userId: req.user._id,
    title: req.body.title,
    description: req.body.description || '',
    priority: req.body.priority || 'medium',
    dueDate: req.body.dueDate || null,
    category: req.body.category || 'General'
  });

  const newTask = await task.save();
  res.status(201).json(newTask);
});
```

```js
router.get('/', async (req, res) => {
  let filter = { userId: req.user._id };
  const tasks = await Task.find(filter).sort({ createdAt: -1 }).exec();
  res.json(tasks);
});
```

```js
router.patch('/:id', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (req.body.title !== undefined) task.title = req.body.title;
  const updatedTask = await task.save();
  res.json(updatedTask);
});
```

```js
router.delete('/:id', async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ message: 'Task deleted successfully' });
});
```

### Output / Screenshot Space
`[Insert screenshot: MongoDB service running]`

`[Insert screenshot: documents visible in MongoDB Compass or mongosh]`

---

## Practical 5
## To Build a Data Model with MongoDB and Mongoose

### Aim
To define structured schemas for the application data using Mongoose.

### Required Theory
Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.  
It allows us to:
- define schemas
- add validation
- specify default values
- create models for database operations

This project has two main models:
- `User`
- `Task`

### Important Code Snippets
From `backend/models/User.js`
```js
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);
```

From `backend/models/Task.js`
```js
const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});
```

### Explanation
- `required: true` ensures important fields are compulsory
- `unique: true` prevents duplicate email registration
- `enum` restricts priority values
- `timestamps` and date fields help track record creation and updates
- `userId` links a task to the logged-in user

### Output / Screenshot Space
`[Insert screenshot: User and Task schema files]`

---

## Practical 6
## Connect Express Application to MongoDB using Mongoose

### Aim
To connect the Express backend application with the MongoDB database using Mongoose.

### Required Theory
The Express server must establish a database connection before serving API requests.  
Mongoose uses `mongoose.connect()` to connect to the MongoDB URI.

### Important Code Snippet
From `backend/config/db.js`
```js
import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';
  const conn = await mongoose.connect(mongoURI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};
```

From `backend/server.js`
```js
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB();
```

### Commands Used
```bash
cd backend
npm install
npm run dev
```

### Environment File
Create `backend/.env`
```env
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-secret-key
PORT=5000
```

### Explanation
- `dotenv.config()` loads values from `.env`
- `connectDB()` opens MongoDB connection
- Express middleware handles JSON request bodies
- Backend starts only after successful database connection

### Output / Screenshot Space
`[Insert screenshot: terminal showing MongoDB connected]`

---

## Practical 7
## To Create an Angular Application and Working with its Components

### Aim
To create an Angular frontend and divide the interface into reusable standalone components.

### Required Theory
Angular applications are built from components.  
A component usually contains:
- TypeScript logic
- HTML template
- CSS styling

In this project, the main components are:
- `AuthComponent`
- `TodoListComponent`
- `TodoFormComponent`
- `TodoItemComponent`

### Commands Used
```bash
cd UI
npm install
npm start
```

### Important Code Snippets
From `UI/src/app/app.ts`
```ts
@Component({
  selector: 'app-root',
  imports: [CommonModule, TodoListComponent, AuthComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
```

From `UI/src/app/components/auth/auth.component.ts`
```ts
export class AuthComponent {
  mode: 'login' | 'register' = 'login';
  form = {
    name: '',
    email: '',
    password: ''
  };
}
```

From `UI/src/app/components/todo-list/todo-list.component.ts`
```ts
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  showForm = false;
  showFilters = true;
}
```

### Explanation
- `App` is the root component
- `AuthComponent` handles login and registration
- `TodoListComponent` shows all todo operations
- `TodoFormComponent` is used for adding and editing tasks
- `TodoItemComponent` displays each individual todo item

### Output / Screenshot Space
`[Insert screenshot: Angular component folder structure]`

---

## Practical 8
## To Build a Single-Page Application with Angular

### Aim
To build a SPA where the user interacts with the todo system without full page reloads.

### Required Theory
A Single-Page Application loads once in the browser, then updates content dynamically using components and services.  
Angular achieves this using:
- data binding
- component communication
- services
- HTTP client

This project behaves as an SPA because:
- login/register happens in the same frontend
- task create/update/delete happens instantly
- data refreshes dynamically after API calls

### Important Code Snippets
From `UI/src/app/app.html`
```html
<app-auth
  *ngIf="!isCheckingSession && !currentUser"
  (authenticated)="onAuthenticated($event)"
></app-auth>

<app-todo-list
  *ngIf="!isCheckingSession && currentUser"
  [currentUser]="currentUser"
  (logout)="onLogout()"
></app-todo-list>
```

From `UI/src/app/services/todo.service.ts`
```ts
private tasksSubject = new BehaviorSubject<Task[]>([]);
public tasks$ = this.tasksSubject.asObservable();
```

```ts
this.http.get<Task[]>(this.apiUrl, { params, headers: this.authService.getAuthHeaders() })
  .pipe(tap(tasks => this.tasksSubject.next(tasks)))
  .subscribe();
```

### Explanation
- `*ngIf` swaps between login screen and todo screen
- `BehaviorSubject` stores current tasks in memory
- Angular updates the UI as soon as data changes
- No manual page reload is needed for normal operations

### Output / Screenshot Space
`[Insert screenshot: login page]`

`[Insert screenshot: todo dashboard after login]`

---

## Practical 9
## To Construct a Simple Login Page Web Application to Authenticate Users using MEAN Stack

### Aim
To create a user authentication system using Angular frontend, Express backend, MongoDB database, and Mongoose models.

### Required Theory
Authentication verifies user identity before granting access to application resources.  
In this project:
- registration creates a new user
- login validates email and password
- token-based authentication protects task APIs
- the session is restored on reload using stored token and user data

### Authentication Flow in This Project
1. User opens Angular app
2. User registers or logs in
3. Backend verifies credentials
4. Backend returns token and user data
5. Frontend stores session
6. Protected todo APIs send token in `Authorization` header
7. Backend middleware validates token before allowing CRUD operations

### Important Code Snippets
From `backend/routes/auth.js`
```js
router.post('/register', async (req, res) => {
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password)
  });

  return res.status(201).json({
    token: generateToken(user),
    user: sanitizeUser(user)
  });
});
```

```js
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
});
```

From `backend/middleware/auth.js`
```js
const authHeader = req.headers.authorization;
const token = authHeader.slice(7);
const payload = verifyToken(token);
const user = await User.findById(payload.sub).select('-passwordHash');
req.user = user;
```

From `UI/src/app/services/auth.service.ts`
```ts
login(payload: { email: string; password: string }): Observable<AuthUser> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
    tap((response) => this.storeSession(response)),
    map((response) => response.user)
  );
}
```

```ts
getAuthHeaders(): HttpHeaders {
  const token = this.getToken();
  return token
    ? new HttpHeaders({ Authorization: `Bearer ${token}` })
    : new HttpHeaders();
}
```

### Commands Used
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd ../UI
npm install
npm start
```

### Testing the Login Practical
1. Open the Angular app in browser
2. Register a new user account
3. Login using the registered email and password
4. Add a new todo
5. Reload the page and verify session persistence
6. Logout and verify protected access is removed

### Output / Screenshot Space
`[Insert screenshot: registration page]`

`[Insert screenshot: login success]`

`[Insert screenshot: session retained after reload]`

---

## Project Folder Reference
```text
MEAN_Practical/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/Task.js
│   ├── models/User.js
│   ├── routes/auth.js
│   ├── routes/tasks.js
│   └── server.js
└── UI/
    └── src/app/
        ├── components/auth/
        ├── components/todo-form/
        ├── components/todo-item/
        ├── components/todo-list/
        ├── models/
        └── services/
```

---

## Result
The MEAN stack practical application was successfully implemented.  
MongoDB was used for storing users and todos, Mongoose was used for schema modeling, Express was connected to MongoDB through Mongoose, Angular components were used to build the frontend SPA, and a login/registration system was implemented to authenticate users.

---

## Viva / Conclusion Points
- MongoDB stores data in document form
- Mongoose provides schema-based modeling
- Express builds REST APIs
- Angular components create modular UI
- SPA avoids full-page reloads
- Authentication secures the todo operations
- `userId` ensures one user only sees their own tasks
