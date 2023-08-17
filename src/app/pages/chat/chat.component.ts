import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  showSettingsDropdown: boolean = false;
  user: any = null;
  searchQuery = '';
  searchResult: any[] = [];
  searchTimer: any = null;
  conversationsList: any[] = [];
  constructor(private helper: HelperService, private router: Router) {}

  async ngOnInit() {
    this.helper.firebase.updateUserStatus('active')
    this.user = await this.helper.firebase.getUserInfo();
    this.toggleMode();
    this.helper.firebase.getUserConversations().subscribe({
      next:(res) => {
        this.conversationsList = res;
      },
      error:(err) => {
        console.log('err', err);
      }
    })
  }

  handleLogout() {
    this.helper.firebase.logout().then(() => {
      this.router.navigate(['login']);
    });
  }

  toggleMode() {
    let themeToggleDarkIcon: any = document.getElementById(
      'theme-toggle-dark-icon'
    );
    let themeToggleLightIcon: any = document.getElementById(
      'theme-toggle-light-icon'
    );

    document.documentElement.classList.toggle('dark');
  }

  handleSearch() {
    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      this.helper.firebase.getSearchedUsers(this.searchQuery).then(res => {
        console.log('SEARCH DATA', res);
        this.searchResult = res;
      }).catch(err => {
        console.log('SEARCH ERROR', err);
        
      });
    }, 1000);
  }

  createConversation(receiverId:string){
    this.helper.firebase.createConversation(receiverId).then(res=>{
      console.log('CONVERSATION', res, receiverId);
      this.searchQuery = '';
    })
  }

  
}
