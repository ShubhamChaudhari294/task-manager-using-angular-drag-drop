import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appconfig } from '../environments/config';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(Appconfig.URL + '/tasks/listusers');
  }

  addTask(task: FormData) {
    return this.http.post(Appconfig.URL + '/tasks/create', task);
  }

  updateTask(task: FormData) {
    return this.http.post(Appconfig.URL + '/tasks/update', task);
  }

  deleteTask(taskId: FormData) {
    return this.http.post(Appconfig.URL + '/tasks/delete', taskId);
  }

  getTasks() {
    return this.http.get(Appconfig.URL + '/tasks/list');
  }
}
