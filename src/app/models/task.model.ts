export interface Task {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date | string;
  category: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
