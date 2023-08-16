import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authForm!: FormGroup;
  mode: 'login' | 'signup' = 'login';
  isLoading = false;

  constructor(
    private helper: HelperService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  loginWithGoogle() {
    this.helper.firebase
      .continueWithGoogle()
      .then((res) => {
        this.helper.common.showAlert('Login Successful', 'success');
        this.router.navigate(['chat']);
      })
      .catch((e) => {
        this.helper.common.showAlert(e.message, 'error');
      });
  }

  loginOrSignup() {
    if(this.mode === 'login') {
      this.authForm.get('name')?.setErrors(null);
    }
    if (!this.authForm.valid) {
      this.helper.common.showAlert(
        'Please fill all the fields properly!',
        'error'
      );
      return;
    }
    this.isLoading = true;
    if (this.mode === 'login') {
      const { email, password } = this.authForm.value;
      this.helper.firebase
        .userLogin({ email, password })
        .then(() => {
          this.helper.common.showAlert('Login Successful', 'success');
          this.router.navigate(['chat']);
        })
        .catch((e) => {
          this.helper.common.showAlert("Invalid Credentials", 'error');          
        })
        .finally(() => (this.isLoading = false));
    } else {
      const { name, email, password } = this.authForm.value;
      this.helper.firebase
        .createUser({ name, email, password })
        .then(() => {
          this.helper.common.showAlert('Login Successful', 'success');
          this.router.navigate(['chat']);
        })
        .catch((e) => {
          this.helper.common.showAlert(e.code.split('/')[1].split('-').join(' '), 'error');          
        })
        .finally(() => (this.isLoading = false));
    }
  }
}
