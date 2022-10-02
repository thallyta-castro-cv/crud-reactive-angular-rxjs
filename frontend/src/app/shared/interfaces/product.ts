import { Department } from './department';

export interface Product {
  name: string;
  departments: Department[],
  stock: number;
  price: number;
  _id?: string;
}
