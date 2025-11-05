import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogin, IPublicKey } from 'src/app/shared/interface/api-interface';
import { ApiService } from 'src/app/shared/serices/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    this.apiService.publicKey().subscribe((res: IPublicKey) => {
      this.apiService
        .login(this.loginForm.value, res.data.public_key)
        .subscribe((res: ILogin) => {
          sessionStorage.setItem('token', res.data.token);
          this.router.navigate(['home']);
        });
    });
  }
}
