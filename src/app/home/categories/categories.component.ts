import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICategories,
  ICategoryData,
  ICreateCategory,
  IEditCategory,
} from 'src/app/shared/interface/api-interface';
import { ApiService } from 'src/app/shared/serices/api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: ICategoryData[] = [];
  sidebarVisible: boolean = false;
  action: 'add' | 'edit' | undefined;

  categoryForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.apiService.getCategories(100, 0).subscribe((res: ICategories) => {
      res.data.category.forEach((category) => this.categories.push(category));
    });
  }

  onClickAddCategory() {
    this.action = 'add';
    this.sidebarVisible = true;
  }

  onClickEditCategory(category: ICategoryData) {
    this.action = 'edit';
    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
    });
    this.sidebarVisible = true;
  }

  onCloseCategory() {
    this.sidebarVisible = false;
    this.categoryForm.reset();
  }

  onSubmit() {
    switch (this.action) {
      case 'add': {
        this.apiService
          .addCategory(this.categoryForm.value)
          .subscribe((res: ICreateCategory) => {
            this.onCloseCategory();
            this.categories = [];
            this.fetchCategories();
          });
        break;
      }
      case 'edit': {
        const { id, ...body } = this.categoryForm.value;
        this.apiService
          .editCategory(id, body)
          .subscribe((res: IEditCategory) => {
            this.onCloseCategory();
            this.categories = [];
            this.fetchCategories();
          });
        break;
      }
    }
  }

  onOpenCategory(category: ICategoryData) {
    this.router.navigate(['..', 'category', category.id], {
      relativeTo: this.route,
    });
  }
}
