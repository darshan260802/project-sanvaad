import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  showAlert(message: string, type: 'error' | 'success', timeout = 3000): void {
    const notify = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      },
      dismissible: true,
      duration: timeout,
    });

    if (type === 'error') {
      notify.error(message);
    } else {
      notify.success(message);
    }
  }
}
