import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HelperService} from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private helper: HelperService, private router: Router) {
  }

  ngOnInit() {
    this.toggleMode()
  }

  handleLogout() {
    this.helper.firebase.logout().then(() => {
      this.router.navigate(['login']);
    });
  }

  toggleMode() {
    let themeToggleDarkIcon: any = document.getElementById('theme-toggle-dark-icon');
    let themeToggleLightIcon: any = document.getElementById('theme-toggle-light-icon');

    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      themeToggleLightIcon?.classList.remove('hidden');
    } else {
      themeToggleDarkIcon?.classList.remove('hidden');
    }
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
