import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/task';
import { TaskService } from 'src/app/services/task-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit, OnDestroy {
  usersList: User[];
  isEditMode = false;
  taskId: string;
  taskForm = this.fb.group({
    message: ['', Validators.required],
    due_date: [''],
    priority: [''],
    assigned_to: [''],
  });
  busy: Subscription;
  busy1: Subscription;
  busy2: Subscription;
  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ) {
    if (this.router.url === '/edit-task') {
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.getUsers();
    if (this.isEditMode) {
      this.assignValuesToForm();
    }
  }

  assignValuesToForm() {
    const task = JSON.parse(window.localStorage.getItem('task'));
    const dueDate = moment(task.due_date).format('YYYY-MM-DDTHH:mm');
    this.taskForm.controls['message'].setValue(task.message);
    this.taskForm.controls['due_date'].setValue(dueDate);
    this.taskForm.controls['priority'].setValue(task.priority);
    this.taskForm.controls['assigned_to'].setValue(task.assigned_to);
    this.taskId = task.id;
  }

  getUsers() {
    this.busy = this.taskService.getUsers().subscribe({
      next: (response: any) => {
        if (response.error) {
          this.alertService.handleResponse(response);
        }
        this.usersList = response.users;
      },
    });
  }

  submit() {
    console.log(this.taskForm.value.due_date);
    let due_date = new Date(this.taskForm.value.due_date);
    this.taskForm.value.due_date = moment(due_date).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    const formData = new FormData();
    formData.set('message', this.taskForm.value.message);
    formData.set('due_date', this.taskForm.value.due_date);
    formData.set('priority', this.taskForm.value.priority);
    formData.set('assigned_to', this.taskForm.value.assigned_to);
    if (this.isEditMode) {
      this.editTask(formData);
    } else {
      this.createTask(formData);
    }
  }

  createTask(formData) {
    this.busy1 = this.taskService.addTask(formData).subscribe({
      next: (response: any) => {
        this.alertService.handleResponse(response);
      },
    });
  }

  editTask(formData) {
    formData.set('taskid', this.taskId);
    this.busy2 = this.taskService.updateTask(formData).subscribe({
      next: (response: any) => {
        this.alertService.handleResponse(response);
      },
    });
  }

  ngOnDestroy() {
    this.busy1 ? this.busy1.unsubscribe() : '';
    this.busy2 ? this.busy2.unsubscribe(): '';
    this.busy ? this.busy.unsubscribe(): '';
  }
}
