import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this.snackBar.open(message, 'Close', config);
  }

  handleResponse(response: any) {
    const config: MatSnackBarConfig = {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    };

    if (response.status === 'error') {
      config.panelClass = 'background-red';
      this.openSnackBar('Error : ' + response.error, config);
    } else {
      config.panelClass = 'background-green';
      this.openSnackBar('Success : ' + (response.message ? response.mesaage : 'Success'), config);
    }
  }
}
