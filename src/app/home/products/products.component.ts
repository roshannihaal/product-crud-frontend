import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import {
  ICategoryData,
  IGetCategory,
  IGetProducts,
  IProductData,
} from 'src/app/shared/interface/api-interface';
import { ApiService } from 'src/app/shared/serices/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  category: ICategoryData | undefined;
  products: IProductData[] = [];
  backend_url = environment.BACKEND_URL;
  action: 'add' | 'edit' | undefined;
  sidebarVisible: boolean = false;
  imageError: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  productForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    category_id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    image: new FormControl(''),
    price: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id')!;
    this.fetchCategory(categoryId);
    this.fetchProducts(categoryId);
  }

  fetchCategory(id: string) {
    this.apiService.getCategory(id).subscribe((res: IGetCategory) => {
      this.category = res.data.category;
    });
  }

  fetchProducts(id: string) {
    this.apiService.getProducts(id, 100, 0).subscribe((res: IGetProducts) => {
      res.data.product.forEach((product) => this.products.push(product));
    });
  }

  onClickAddProduct() {
    this.action = 'add';
    this.productForm.patchValue({
      category_id: this.category?.id,
    });
    this.sidebarVisible = true;
  }

  onClickEditProduct(product: IProductData) {
    this.action = 'edit';
    this.productForm.patchValue({
      id: product.id,
      category_id: this.category?.id,
      name: product.name,
      image: product.image,
      price: product.price,
    });
    if (product.image) {
      this.imagePreview = `${this.backend_url}/${product.image}`;
    }

    this.sidebarVisible = true;
  }

  onCloseProduct() {
    this.sidebarVisible = false;
    this.productForm.reset();
  }

  onSubmit() {
    switch (this.action) {
      case 'add': {
        this.apiService.addProduct(this.productForm.value).subscribe((res) => {
          this.onCloseProduct();
          this.products = [];
          if (this.category) {
            this.fetchProducts(this.category.id);
          }
        });
        break;
      }
      case 'edit': {
        const { id, ...body } = this.productForm.value;
        this.apiService.editProduct(id, body).subscribe((res) => {
          this.onCloseProduct();
          this.products = [];
          if (this.category) {
            this.fetchProducts(this.category.id);
          }
        });
        break;
      }
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(file.name)) {
      this.imageError = 'Invalid file type. Only JPG, JPEG, PNG allowed.';
      this.productForm.patchValue({ image: '' });
      this.imagePreview = null;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.imageError = 'File size exceeds 2MB.';
      this.productForm.patchValue({ image: '' });
      this.imagePreview = null;
      return;
    }

    this.imageError = null;
    this.productForm.patchValue({ image: file });

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onClickDeleteProduct(event: Event, product: IProductData) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure want to delete ${product.name}?`,
      header: `Delete ${product.name}`,
      icon: 'none',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass:
        'bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600',
      rejectButtonStyleClass:
        'bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400',
      accept: () => {
        this.deleteProduct(product);
      },
      reject: () => {},
    });
  }

  deleteProduct(product: IProductData) {
    this.apiService.deleteProduct(product.id).subscribe((res) => {
      this.products = [];
      if (this.category) {
        this.fetchProducts(this.category.id);
      }
    });
  }
}
