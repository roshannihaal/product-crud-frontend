import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/serices/api.service';
import { IPublicKey, ISignup } from 'src/app/shared/interface/api-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(24),
    ]),
    confirm_password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(24),
    ]),
  });

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    this.apiService.publicKey().subscribe((res: IPublicKey) => {
      this.apiService
        .signup(this.signupForm.value, res.data.public_key)
        .subscribe((res: ISignup) => {
          sessionStorage.setItem('token', res.data.token);
          this.router.navigate(['home']);
        });
    });
  }
}
