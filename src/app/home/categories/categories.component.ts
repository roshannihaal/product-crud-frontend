import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
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
  searchItem: string = '';

  categoryForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.apiService
      .getCategories(100, 0, this.searchItem)
      .subscribe((res: ICategories) => {
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

  onClickDeleteCategory(event: Event, category: ICategoryData) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure? All the products of ${category.name} will be deleted too.`,
      header: `Delete ${category.name}`,
      icon: 'none',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass:
        'bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600',
      rejectButtonStyleClass:
        'bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400',
      accept: () => {
        this.deleteCategory(category);
      },
      reject: () => {},
    });
  }

  deleteCategory(category: ICategoryData) {
    this.apiService.deleteCategory(category.id).subscribe((res) => {
      this.categories = [];
      this.fetchCategories();
    });
  }

  onSearch() {
    this.categories = [];
    this.fetchCategories();
  }

  onClear() {
    this.searchItem = '';
    this.categories = [];
    this.fetchCategories();
  }
}
