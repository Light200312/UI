import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  formData: Task = {
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    category: 'General'
  };

  isSubmitting = false;
  errorMessage = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    if (this.task) {
      this.formData = { ...this.task };
    }
  }

  onSubmit(): void {
    if (!this.formData.title.trim()) {
      this.errorMessage = 'Task title is required';
      return;
    }

    if (this.formData.title.length > 100) {
      this.errorMessage = 'Task title must be less than 100 characters';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.task && this.task._id) {
      // Update existing task
      this.todoService.updateTask(this.task._id, this.formData).subscribe({
        next: () => {
          this.onSave.emit();
          this.reset();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error updating task';
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new task
      this.todoService.createTask(this.formData).subscribe({
        next: () => {
          this.onSave.emit();
          this.reset();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error creating task';
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.reset();
    this.onCancel.emit();
  }

  reset(): void {
    this.formData = {
      title: '',
      description: '',
      completed: false,
      priority: 'medium',
      category: 'General'
    };
    this.errorMessage = '';
    this.isSubmitting = false;
  }
}
