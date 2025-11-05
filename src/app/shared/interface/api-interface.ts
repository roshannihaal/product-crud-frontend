export interface ISignup {
  message: string;
  data: IData;
}

interface IData {
  token: string;
  user: IUser;
}

interface IUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ILogin extends ISignup {}

export interface ICategories {
  message: string;
  data: {
    category: ICategoryData[];
  };
}

export interface ICategoryData {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateCategory {
  message: string;
  data: {
    category: ICategoryData;
  };
}

export interface IEditCategory extends ICreateCategory {}

export interface IGetCategory extends ICreateCategory {}

export interface IProductData {
  id: string;
  category_id: string;
  name: string;
  image?: string;
  price: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface IGetProducts {
  message: string;
  data: {
    product: IProductData[];
  };
}

export interface IUpdateProduct {
  message: string;
  data: {
    product: IProductData;
  };
}

export interface IAddProduct extends IUpdateProduct {}
