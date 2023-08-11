import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  constructor(private helper:HelperService, private router:Router){}

  handleLogout(){
    this.helper.firebase.logout().then(() => {
      this.router.navigate(['login']);
    });
  }
}
