import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/interfaces/task';
import { AlertService } from 'src/app/services/alert.service';
import { TaskService } from 'src/app/services/task-service.service';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  highPriorityTasks: Task[] = [];
  backupHighPriorityTasks: Task[] = [];
  mediumPriorityTasks: Task[] = [];
  backupMediumPriorityTasks: Task[] = [];
  lowPriorityTasks: Task[] = [];
  backupLowPriorityTasks: Task[] = [];
  busy: Subscription;
  busy1: Subscription;
  busy2: Subscription;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getTasks();
  }

  goToAddTaskPage() {
    this.router.navigate(['/add-task']);
  }

  getTasks() {
    this.busy = this.taskService.getTasks().subscribe({
      next: (response: any) => {
        if (response.error) {
          this.alertService.handleResponse(response);
        } else {
          response.tasks.forEach((task) => {
            if (task.priority === '1') {
              this.highPriorityTasks.push(task);
            } else if (task.priority === '2') {
              this.mediumPriorityTasks.push(task);
            } else if (task.priority === '3') {
              this.lowPriorityTasks.push(task);
            }
          });
        }
      },
    });
    this.backupHighPriorityTasks = this.highPriorityTasks;
    this.backupLowPriorityTasks = this.lowPriorityTasks;
    this.backupMediumPriorityTasks = this.mediumPriorityTasks;
  }

  deleteTask(event) {
    const formData = new FormData();
    formData.set('taskid', event.id);
    this.busy1 = this.taskService.deleteTask(formData).subscribe({
      next: (response: any) => {
        if (response.error) {
          this.alertService.handleResponse(response);
        } else {
          this.deleteFromLocalData(event.type, event.index);
          this.alertService.handleResponse(response);
        }
      },
    });
  }

  editItem(task) {
    window.localStorage.setItem('task', JSON.stringify(task));
    this.router.navigate(['/edit-task']);
  }

  deleteFromLocalData(type, index) {
    // This is used to avoid unnecessary API call for getTasks() which will result in better performance
    if (type === 'high') {
      this.highPriorityTasks.splice(index, 1);
      this.backupHighPriorityTasks.splice(index, 1);
    } else if (type === 'medium') {
      this.mediumPriorityTasks.splice(index, 1);
      this.backupMediumPriorityTasks.splice(index, 1);
    } else {
      this.lowPriorityTasks.splice(index, 1);
      this.backupLowPriorityTasks.splice(index, 1);
    }
  }

  search(event) {
    this.highPriorityTasks = this.backupHighPriorityTasks.filter((task) => {
      return task.message
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    this.lowPriorityTasks = this.backupLowPriorityTasks.filter((task) => {
      return task.message
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    this.mediumPriorityTasks = this.backupMediumPriorityTasks.filter((task) => {
      return task.message
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
  }

  filterByDate(event) {
    this.highPriorityTasks = this.backupHighPriorityTasks.filter((task) => {
      const date = moment(task.due_date).format('yyyy-M-D');
      return moment(date).isSame(event.target.value);
    });
    this.lowPriorityTasks = this.backupLowPriorityTasks.filter((task) => {
      const date = moment(task.due_date).format('yyyy-M-D');
      return moment(date).isSame(event.target.value);
    });
    this.mediumPriorityTasks = this.backupMediumPriorityTasks.filter((task) => {
      const date = moment(task.due_date).format('yyyy-M-D');
      return moment(date).isSame(event.target.value);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropHighPriorityTasksList(event: CdkDragDrop<string[]>) {
    event.item.data.priority = 1;
    this.updatePriority(event);
  }

  updatePriority(event) {
    const formData = new FormData();
    formData.set('priority', event.item.data.priority);
    formData.set('taskid', event.item.data.id);
    this.busy2 = this.taskService.updateTask(formData).subscribe({
      next: (response: any) => {
        if (response.error) {
          this.alertService.handleResponse(response);
        } else {
          this.drop(event);
        }
      },
    });
  }

  dropMediumPriorityTasksList(event: CdkDragDrop<string[]>) {
    event.item.data.priority = 2;
    this.updatePriority(event);
  }

  dropLowPriorityTasksList(event: CdkDragDrop<string[]>) {
    event.item.data.priority = 3;
    this.updatePriority(event);
  }

  ngOnDestroy() {
    this.busy1 ? this.busy1.unsubscribe() : '';
    this.busy2 ? this.busy2.unsubscribe(): '';
    this.busy ? this.busy.unsubscribe(): '';
  }
}
