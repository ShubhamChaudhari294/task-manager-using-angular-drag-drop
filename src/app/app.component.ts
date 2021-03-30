import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'taskManager';
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = true;
  spinnerWithoutBackdrop = false;
}
