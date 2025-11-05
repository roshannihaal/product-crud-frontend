import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICreateBulkProduct } from 'src/app/shared/interface/api-interface';
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

  onDownloadSample() {
    const filePath = `../assets/sample.csv`;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'sample.csv';
    link.click();
  }

  onCsvUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      alert('Please select a CSV file');
      return;
    }

    const file = target.files[0];

    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.apiService.bulkCreateProduct(formData).subscribe({
      next: (res: ICreateBulkProduct) => {
        alert(res.message);
        target.value = '';
      },
      error: (err) => {
        alert(err.error.message);
        target.value = '';
      },
    });
  }

  onDownloadReport() {
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
