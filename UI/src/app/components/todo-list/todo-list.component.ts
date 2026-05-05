import { Component, OnInit, OnDestroy, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';
import { AuthUser } from '../../models/user.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoFormComponent, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  currentUser: AuthUser | null = null;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  showForm = false;
  editingTask: Task | null = null;
  
  // Filter and sort options
  filterStatus = 'all';
  filterPriority = 'all';
  filterCategory = 'all';
  sortBy = 'createdAt';
  searchQuery = '';
  showFilters = true;

  categories: string[] = ['General'];

  private subs = new Subscription();

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {
    // afterNextRender fires once after the first client-side render and never on the server.
    // This is the Angular 17+ idiomatic way to make authenticated API calls in SSR apps —
    // it guarantees localStorage is available (so the token can be read) and avoids
    // NG0100 ExpressionChangedAfterItHasBeenCheckedError from SSR hydration.
    afterNextRender(() => {
      this.loadTasks();
    });
  }

  ngOnInit(): void {
    // The auth guard guarantees a token exists before this component mounts.
    // hydrateSessionFromStorage() has already set the user synchronously.
    // So we can load tasks immediately without waiting for sessionReady$.

    // Track the current user for display (name in header etc.)
    this.subs.add(
      this.authService.user$.pipe(
        filter((u): u is AuthUser => u !== null),
        take(1)
      ).subscribe((u) => {
        this.currentUser = u;
      })
    );

    // Subscribe to task stream — receives updates from loadTasks() and mutations.
    // markForCheck() forces Angular to re-render after SSR hydration suppresses automatic detection.
    this.subs.add(
      this.todoService.getTasks().subscribe((tasks) => {
        this.tasks = tasks;
        this.filterAndSortTasks();
        this.extractCategories();
        this.cdr.markForCheck();
      })
    );

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadTasks(): void {
    this.todoService.loadTasks(this.sortBy);
  }

  filterAndSortTasks(): void {
    let filtered = [...this.tasks];

    // Apply filters
    if (this.filterStatus === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (this.filterStatus === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }

    if (this.filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === this.filterPriority);
    }

    if (this.filterCategory !== 'all') {
      filtered = filtered.filter(task => task.category === this.filterCategory);
    }

    // Apply search
    if (this.searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }

    this.filteredTasks = filtered;
  }

  extractCategories(): void {
    const cats = new Set(this.tasks.map(t => t.category || 'General'));
    this.categories = Array.from(cats);
  }

  onFilterChange(): void {
    this.filterAndSortTasks();
  }

  onSortChange(): void {
    this.loadTasks();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  openAddForm(): void {
    this.editingTask = null;
    this.showForm = true;
  }

  openEditForm(task: Task): void {
    this.editingTask = { ...task };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTask = null;
  }

  onTaskSaved(): void {
    this.closeForm();
    this.loadTasks();
  }

  onTaskDeleted(): void {
    this.loadTasks();
  }

  toggleTask(task: Task): void {
    if (task._id) {
      this.todoService.toggleTask(task._id).subscribe({
        error: (error) => console.error('Error toggling task:', error)
      });
    }
  }

  deleteTask(task: Task): void {
    if (task._id && confirm('Are you sure you want to delete this task?')) {
      this.todoService.deleteTask(task._id).subscribe({
        error: (error) => console.error('Error deleting task:', error)
      });
    }
  }

  clearCompletedTasks(): void {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
      const completedTasks = this.tasks.filter(t => t.completed);
      completedTasks.forEach(task => {
        if (task._id) {
          this.todoService.deleteTask(task._id).subscribe();
        }
      });
    }
  }

  getCompletedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  getPendingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  getTotalCount(): number {
    return this.tasks.length;
  }

  requestLogout(): void {
    this.authService.logout();
    this.todoService.clearTasks();
    // Redirect to login after logout
    this.router.navigate(['/login']);
  }

  viewTaskDetail(task: Task): void {
    if (task._id) {
      this.router.navigate(['/task', task._id]);
    }
  }
}
