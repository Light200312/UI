import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:5000/api/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  // Load all tasks
  loadTasks(sortBy: string = 'createdAt', filters?: any): void {
    let params = new HttpParams().set('sortBy', sortBy);

    if (filters) {
      if (filters.completed !== undefined) {
        params = params.set('completed', filters.completed);
      }
      if (filters.priority) {
        params = params.set('priority', filters.priority);
      }
      if (filters.category) {
        params = params.set('category', filters.category);
      }
    }

    this.http.get<Task[]>(this.apiUrl, { params })
      .pipe(
        tap(tasks => this.tasksSubject.next(tasks))
      )
      .subscribe({
        error: (error) => console.error('Error loading tasks:', error)
      });
  }

  // Get all tasks as observable
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  // Get a single task by ID
  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  private sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      const first = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const second = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return second - first;
    });
  }

  // Create a new task
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task)
      .pipe(
        tap((createdTask) => {
          this.tasksSubject.next(this.sortTasks([createdTask, ...this.tasksSubject.value]));
        })
      );
  }

  // Update a task
  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(
        tap((updatedTask) => {
          const updatedTasks = this.tasksSubject.value.map((existingTask) =>
            existingTask._id === id ? updatedTask : existingTask
          );
          this.tasksSubject.next(this.sortTasks(updatedTasks));
        })
      );
  }

  // Delete a task
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.tasksSubject.next(this.tasksSubject.value.filter((task) => task._id !== id));
        })
      );
  }

  // Toggle task completion status
  toggleTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/toggle`, {})
      .pipe(
        tap((updatedTask) => {
          const updatedTasks = this.tasksSubject.value.map((existingTask) =>
            existingTask._id === id ? updatedTask : existingTask
          );
          this.tasksSubject.next(this.sortTasks(updatedTasks));
        })
      );
  }
}
