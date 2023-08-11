import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  showAlert(
    title: string,
    message: string,
    type: SweetAlertIcon,
    timeout = 3000
  ): void {
    Swal.fire({
      icon: type,
      position: "top-end",
      text: message,
      titleText: title,
      toast: true,
      showConfirmButton: false,
      timer: timeout,
      showCloseButton: true,
    }).finally(() => {});
  }
}
