import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() task!: Task;
  @Output() onToggle = new EventEmitter<Task>();
  @Output() onEdit = new EventEmitter<Task>();
  @Output() onDelete = new EventEmitter<Task>();

  toggleTask(): void {
    this.onToggle.emit(this.task);
  }

  editTask(): void {
    this.onEdit.emit(this.task);
  }

  deleteTask(): void {
    this.onDelete.emit(this.task);
  }

  getPriorityClass(): string {
    return `priority-${this.task.priority}`;
  }

  getStatusIcon(): string {
    return this.task.completed ? '✓' : '○';
  }

  getDueInDays(): number | null {
    if (!this.task.dueDate) return null;
    const due = new Date(this.task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  isOverdue(): boolean {
    const daysLeft = this.getDueInDays();
    return daysLeft !== null && daysLeft < 0 && !this.task.completed;
  }

  isDueToday(): boolean {
    const daysLeft = this.getDueInDays();
    return daysLeft === 0 && !this.task.completed;
  }

  isDueSoon(): boolean {
    const daysLeft = this.getDueInDays();
    return daysLeft !== null && daysLeft > 0 && daysLeft <= 3 && !this.task.completed;
  }

  getDueDateDisplay(): string {
    if (!this.task.dueDate) return '';
    const due = new Date(this.task.dueDate);
    return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
