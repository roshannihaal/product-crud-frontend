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

  onDownload() {
    this.apiService.downloadProductReport().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
