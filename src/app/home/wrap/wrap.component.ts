import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/serices/api.service';

@Component({
  selector: 'app-wrap',
  templateUrl: './wrap.component.html',
  styleUrls: ['./wrap.component.css'],
})
export class WrapComponent {
  constructor(private router: Router, private apiService: ApiService) {}

  onLogout() {
    this.apiService.logout();
  }
}
