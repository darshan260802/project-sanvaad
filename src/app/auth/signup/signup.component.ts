import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private firebaseService:FirebaseService) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
    });
  }

  async handleSignup():Promise<void>{
    const {name, email, password} = this.signupForm.value;
    await this.firebaseService.createUser({name, email, password}).then(res => {
      console.log('From Page', res);
      
    });
  }
}
