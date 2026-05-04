import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Task } from '../../models/task.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { AuthUser } from '../../models/user.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoFormComponent, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  @Input() currentUser: AuthUser | null = null;
  @Output() logout = new EventEmitter<void>();

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  showForm = false;
  editingTask: Task | null = null;
  
  // Filter and sort options
  filterStatus = 'all'; // all, completed, pending
  filterPriority = 'all';
  filterCategory = 'all';
  sortBy = 'createdAt';
  searchQuery = '';
  showFilters = true;

  categories: string[] = ['General'];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.todoService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filterAndSortTasks();
      this.extractCategories();
    });
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
    this.logout.emit();
  }
}
