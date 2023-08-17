import {Component,ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HelperService} from 'src/app/core/services/helper.service';
import {formatDate} from "@angular/common";
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
  scrollTimer:any = null;
  conversationsList: any[] = [];
  conversationId: string = '';
  messageInput: string = '';
  currentMessageSub!:Subscription;
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
        if (!this.conversationsList.length) return;
        this.selectConversation(this.conversationsList[0].uid);
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

trackMessages(index: any, message: any) {
  return message.uid
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

    if(this.currentMessageSub){
      this.currentMessageSub.unsubscribe();
    }

    // get conversation data
    await this.helper.firebase
      .getConversationDetails(conversationId)
      .then((res) => {
        console.log('Receiver', res);
        this.selectedUser = res;
      });

    this.currentMessageSub = this.helper.firebase
      .getConversationMessages(conversationId)
      .subscribe((res) => {
        console.log('mes =>', res);
        this.messages = res;
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
          if(this.chatBody){
            this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight
          }
        },500)
        
      });
  }

  sendMessage() {
    if(!this.messageInput.length) return
    this.helper.firebase
      .createMessage(this.conversationId, this.messageInput)
      .then((res) => {
        console.log('MessageCreated', res);
        this.messageInput = '';
      })
      .catch((err) => {
        console.log('MessageCreationFailed', err);
      });
  }

  getActiveTimeStatus(lastTime: any) {
   if (this.selectedUser.status == 'active'){
     return "Active Now"
   }else{
     return ("Last Active at " +  formatDate(new Date(lastTime), 'MMM d, y, hh:mm a', 'en_US'))
   }

  }


}
