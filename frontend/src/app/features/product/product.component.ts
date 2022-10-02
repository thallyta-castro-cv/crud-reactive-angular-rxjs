import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department';
import { Product } from 'src/app/shared/interfaces/product';
import { ProductService } from './product.service';
import { DepartmentService } from './../department/department.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public form!: FormGroup;
  public products: Product[] = [];
  public product: Product;
  public departments: Department[] = [];

  private unsubscribeNotifier = new Subject<void>;

  constructor(
    private productService: ProductService,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.createform();
    this.loadProducts();
  }

  public createform(): void {
    this.form = this.formBuilder.group({
      _id: [null],
      name: ['', [Validators.required]],
      stock: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0)]],
      departments:[[], [Validators.required]]
    })
  }

  public loadProducts() {
    this.productService.get()
    .pipe(takeUntil(this.unsubscribeNotifier))
    .subscribe((products) => this.products = products);
    this.departmentService.get()
    .pipe(takeUntil(this.unsubscribeNotifier))
    .subscribe((departments) => this.departments = departments);
  }

  save(){
    let data = this.form.value;
    if (data._id != null) {
      this.productService.update(data)
      .subscribe({
        next: () => {
          this.form.reset();
          this.snackBar.open(
            'Produto cadastrado com sucesso! ', 'OK',
            { duration: 2000 });
        },
        error: () => {
          this.snackBar.open(
            'Erro ao cadastrar product! ', 'OK',
            { duration: 2000 });
        }
      });
    } else {
      this.productService.create(data)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Produto atualizado com sucesso! ', 'OK',
            { duration: 2000 });
        },
        error: error => {
          this.snackBar.open(
            'Erro ao atualizar produto! ', 'OK',
            { duration: 2000 });
        }
      });
    }
    this.cancel();
  }

  public delete(product: Product) {
    this.productService.remove(product)
      .subscribe({
          next: () => {
            this.snackBar.open(
              'Produto deletado com sucesso! ', 'OK',
              { duration: 2000 });
          },
          error: () => {
            this.snackBar.open(
              'Erro ao deletar produto! ', 'OK',
              { duration: 2000 });
          }
      })
  }

  public edit(product: Product) {
    this.form.setValue(product);
  }

  public cancel(){
    this.form.reset();
  }

}
