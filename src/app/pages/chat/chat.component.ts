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
  openDropzone: boolean = false;
  selectedUser: any = null;
  searchQuery = '';
  searchResult: any[] = [];
  searchTimer: any = null;
  conversationsList: any[] = [];
  constructor(private helper: HelperService, private router: Router) {}

  async ngOnInit() {
    if (document.readyState === 'complete') {
      if (!!!document.querySelector('app-root')) return;
      this.helper.firebase.updateUserStatus('active');
    } else {
      document.onload = () => {
        if (!!!document.querySelector('app-root')) return;
        this.helper.firebase.updateUserStatus('active');
      };
    }
    this.user = await this.helper.firebase.getUserInfo();
    this.toggleMode();
    this.helper.firebase.getUserConversations().subscribe({
      next: (res) => {
        this.conversationsList = res;
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  handleLogout() {
    this.helper.firebase.logout().then(() => {
      this.router.navigate(['login']);
    });
  }

  toggleMode() {
    // let themeToggleDarkIcon: any = document.getElementById(
    //   'theme-toggle-dark-icon'
    // );
    // let themeToggleLightIcon: any = document.getElementById(
    //   'theme-toggle-light-icon'
    // );
    //
    // document.documentElement.classList.toggle('dark');
    //
    // let themeToggleBtn: any = document.getElementById('theme-toggle');
    //
    // themeToggleBtn?.addEventListener('click', function () {
    //
    //   // toggle icons inside button
    //   themeToggleDarkIcon?.classList.toggle('hidden');
    //   themeToggleLightIcon?.classList.toggle('hidden');
    //
    //   // if set via local storage previously
    //   if (localStorage.getItem('color-theme')) {
    //     if (localStorage.getItem('color-theme') === 'light') {
    //       document.documentElement.classList.add('dark');
    //       localStorage.setItem('color-theme', 'dark');
    //     } else {
    //       document.documentElement.classList.remove('dark');
    //       localStorage.setItem('color-theme', 'light');
    //     }
    //
    //     // if NOT set via local storage previously
    //   } else {
    //     if (document.documentElement.classList.contains('dark')) {
    //       document.documentElement.classList.remove('dark');
    //       localStorage.setItem('color-theme', 'light');
    //     } else {
    //       document.documentElement.classList.add('dark');
    //       localStorage.setItem('color-theme', 'dark');
    //     }
    //   }
    // })
  }
  handleSearch() {
    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      this.helper.firebase
        .getSearchedUsers(this.searchQuery)
        .then((res) => {
          console.log('SEARCH DATA', res);
          this.searchResult = res;
        })
        .catch((err) => {
          console.log('SEARCH ERROR', err);
        });
    }, 1000);
  }

  createConversation(receiverId: string) {
    this.helper.firebase.createConversation(receiverId).then((res) => {
      console.log('CONVERSATION', res, receiverId);
      this.searchQuery = '';
    });
  }
  async selectConversation(conversationId: string) {
    // get conversation data
    await this.helper.firebase.getConversationDetails(conversationId).then((res) => {
      console.log("Receiver",res)
      this.selectedUser = res;
    })

    this.helper.firebase.getConversationMessages(conversationId).subscribe((res) => {
      console.log('mes =>', res);
    });
  }
}
