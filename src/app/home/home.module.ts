import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { WrapComponent } from './wrap/wrap.component';
import { SharedModule } from '../shared/shared.module';
import { ProductComponent } from './product/product.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    WrapComponent,
    ProductComponent,
    CategoriesComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
  ],
})
export class HomeModule {}
