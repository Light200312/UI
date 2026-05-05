import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  taskId: string | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {}

  ngOnInit(): void {
    // Read the :id routing parameter
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id');

      if (!this.taskId) {
        this.router.navigate(['/dashboard']);
        return;
      }

      this.loadTask(this.taskId);
    });
  }

  loadTask(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.todoService.getTask(id).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Task not found or you do not have access.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: '🟢 Low',
      medium: '🟡 Medium',
      high: '🔴 High'
    };
    return labels[priority] ?? priority;
  }
}
