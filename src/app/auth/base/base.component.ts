import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
})
export class BaseComponent {
  constructor(private router: Router) {}

  get isLogin() {
    return this.router.url.includes('login');
  }
}
