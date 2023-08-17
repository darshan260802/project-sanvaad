import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/core/services/helper.service';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';

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
  scrollTimer: any = null;
  conversationsList: any[] = [];
  conversationId: string = '';
  messageInput: string = '';
  currentMessageSub!: Subscription;
  messages: any[] = [];
  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;

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
    this.helper.firebase.getUserConversations().subscribe({
      next: (res) => {
        this.conversationsList = res;
        if (!this.conversationsList.length) return;
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  trackMessages(index: any, message: any) {
    return message.uid;
  }

  handleLogout() {
    this.helper.firebase.updateUserStatus('inactive');
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
          this.searchResult = res;
        })
        .catch((err) => {
          console.log('SEARCH ERROR', err);
        });
    }, 1000);
  }

  createConversation(receiverId: string) {
    this.helper.firebase.createConversation(receiverId).then((res) => {
      this.conversationId = res;
      this.searchQuery = '';
    });
  }

  async selectConversation(conversationId: string) {
    this.conversationId = conversationId;

    if (this.currentMessageSub) {
      this.currentMessageSub.unsubscribe();
    }

    // get conversation data
    await this.helper.firebase
      .getConversationDetails(conversationId)
      .then((res) => {
        this.selectedUser = res;
      });

      this.helper.firebase.getUserUpdates(this.selectedUser.uid).subscribe({
        next: (res) => {
          this.selectedUser = res;
        },
        error: (err) => {
          console.log('err', err);
        },        
      })

    this.currentMessageSub = this.helper.firebase
      .getConversationMessages(conversationId)
      .subscribe((res) => {
        this.messages = res;
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
          if (this.chatBody) {
            this.chatBody.nativeElement.scrollTop =
              this.chatBody.nativeElement.scrollHeight;
          }
        }, 500);
      });
  }

  sendMessage() {
    if (!this.messageInput.length) return;
    this.helper.firebase
      .createMessage(this.conversationId, this.messageInput)
      .then((res) => {
        this.messageInput = '';
      })
      .catch((err) => {
        console.log('MessageCreationFailed', err);
      });
  }

  get activeTimeStatus() {
    if (!('uid' in this.selectedUser) ) return '';
    if (this.selectedUser.status == 'active') {
      return 'Active Now';
    } else {
      
      return (
        'Last Active at ' +
        formatDate(
          new Date(this.selectedUser.lastActive),
          'MMM d, y, hh:mm a',
          'en_US'
        )
      );
    }
  }
}
