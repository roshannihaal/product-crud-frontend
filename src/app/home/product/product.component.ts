import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICategoryData,
  IGetCategory,
} from 'src/app/shared/interface/api-interface';
import { ApiService } from 'src/app/shared/serices/api.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  category: ICategoryData | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}
  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id')!;
    this.fetchCategory(categoryId);
  }

  fetchCategory(id: string) {
    this.apiService.getCategory(id).subscribe((res: IGetCategory) => {
      this.category = res.data.category;
    });
  }
}
