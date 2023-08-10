import { Component, OnInit } from '@angular/core';
import { auth } from 'src/firebase.config';
import { FirebaseService } from './core/services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private fbService:FirebaseService){}

  async ngOnInit(): Promise<void> {
      if(await this.fbService.isLoggedIn()){
        console.log(auth.currentUser);
        
      }
  }
}
