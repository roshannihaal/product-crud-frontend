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
  offset = 0;
  limit = 20;
  loading = false;

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
      .getCategories(this.limit, this.offset, this.searchItem)
      .subscribe((res: ICategories) => {
        this.categories = [...this.categories];
        res.data.category.forEach((category) => this.categories.push(category));
        this.offset += res.data.category.length;
        this.loading = false;
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
            this.categories.push(res.data.category);
            this.offset += 1;
          });
        break;
      }
      case 'edit': {
        const { id, ...body } = this.categoryForm.value;
        this.apiService
          .editCategory(id, body)
          .subscribe((res: IEditCategory) => {
            this.onCloseCategory();
            const index = this.categories.findIndex(
              (category) => category.id === id
            );
            this.categories[index] = res.data.category;
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
      this.categories = this.categories.filter((cat) => cat.id !== category.id);
      this.offset = Math.max(0, this.offset - 1);
    });
  }

  onSearch() {
    this.offset = 0;
    this.limit = 20;
    this.loading = false;
    this.categories = [];
    this.fetchCategories();
  }

  onClear() {
    this.offset = 0;
    this.limit = 20;
    this.loading = false;
    this.searchItem = '';
    this.categories = [];
    this.fetchCategories();
  }

  onScroll() {
    if (this.loading) return;
    this.loading = true;
    this.fetchCategories();
  }
}
