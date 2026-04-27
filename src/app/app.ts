import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, TodoListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
