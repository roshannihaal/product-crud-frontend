import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IAddProduct,
  ICategories,
  ICreateCategory,
  IEditCategory,
  IGetCategory,
  IGetProducts,
  ILogin,
  ISignup,
  IUpdateProduct,
} from '../interface/api-interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private router: Router) {}

  signup(body: {
    email: string;
    password: string;
    confirm_password: string;
  }): Observable<ISignup> {
    return this.http.post<ISignup>('/auth/signup', body);
  }

  login(body: { email: string; password: string }): Observable<ILogin> {
    return this.http.post<ILogin>('/auth/login', body);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['auth']);
  }

  getCategories(
    limit: number,
    offset: number,
    search: string
  ): Observable<ICategories> {
    const params = {
      limit,
      offset,
      search,
    };
    return this.http.get<ICategories>('/category/all', { params });
  }

  getCategory(id: string): Observable<IGetCategory> {
    return this.http.get<IGetCategory>(`/category/${id}`);
  }

  addCategory(body: { name: string }): Observable<ICreateCategory> {
    return this.http.post<ICreateCategory>('/category', body);
  }

  editCategory(id: string, body: { name: string }): Observable<IEditCategory> {
    return this.http.put<IEditCategory>(`/category/${id}`, body);
  }

  deleteCategory(id: string) {
    return this.http.delete(`/category/${id}`);
  }

  getProducts(
    category_id: string,
    limit: number,
    offset: number,
    search: string
  ): Observable<IGetProducts> {
    const params = {
      category_id,
      limit,
      offset,
      search,
    };
    return this.http.get<IGetProducts>('/product/all', { params });
  }

  addProduct(body: {
    name: string;
    price: string;
    image: string;
    category_id: string;
  }): Observable<IAddProduct> {
    const formData = new FormData();
    formData.append('name', body.name);
    formData.append('price', body.price);
    formData.append('category_id', body.category_id);

    if (body.image) {
      formData.append('image', body.image);
    }
    return this.http.post<IAddProduct>('/product', formData);
  }

  editProduct(
    id: string,
    body: {
      name: string;
      price: string;
      image: string;
      category_id: string;
    }
  ): Observable<IUpdateProduct> {
    const formData = new FormData();
    formData.append('name', body.name);
    formData.append('price', body.price);
    formData.append('category_id', body.category_id);

    if (body.image) {
      formData.append('image', body.image);
    }
    return this.http.put<IUpdateProduct>(`/product/${id}`, formData);
  }

  deleteProduct(id: string) {
    return this.http.delete(`/product/${id}`);
  }
}
