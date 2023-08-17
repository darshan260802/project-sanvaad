import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {from} from 'rxjs';
import {HelperService} from 'src/app/core/services/helper.service';

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
  conversationId: string = '';
  messageInput: string = '';

  constructor(private helper: HelperService, private router: Router) {
  }

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
      this.conversationId = res;
      this.searchQuery = '';
    });
  }

  async selectConversation(conversationId: string) {
    this.conversationId = conversationId;
    // get conversation data
    await this.helper.firebase.getConversationDetails(conversationId).then((res) => {
      console.log("Receiver", res)
      this.selectedUser = res;
    })

    this.helper.firebase.getConversationMessages(conversationId).subscribe((res) => {
      console.log('mes =>', res);
    });
  }

  sendMessage() {

  }
}
