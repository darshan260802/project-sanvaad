import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  showSettingsDropdown: boolean = false;
  user:any = null;
  constructor(private helper: HelperService, private router: Router) {}

  async ngOnInit() {
    this.user = await  this.helper.firebase.getUserInfo();
    this.toggleMode();
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
}
