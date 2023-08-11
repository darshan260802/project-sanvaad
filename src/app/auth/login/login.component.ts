import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  authForm!:FormGroup;
  mode:'login'|'signup' = 'login';


  constructor(private helper:HelperService, private fb:FormBuilder){}


  ngOnInit(): void {
      this.authForm = this.fb.group({
        name:['', [this.mode === 'signup' ? Validators.required : null]],
        email:['', [Validators.required, Validators.email]],
        password:['',[Validators.required, Validators.minLength(6)]]
      })
  }

  handleSubmit(){
    console.log(this.authForm.value);
    this.helper.common.showAlert('Login Successful', 'success');
  }


  loginOrSignup(mode: "login" | "signup") {
    if(mode === "login"){
      // console.log(login)
      console.log(mode)
    }else{
      console.log(mode)
    }
  }
}
