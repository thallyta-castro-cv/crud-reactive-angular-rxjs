import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable, tap } from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product';
import { HttpClient } from '@angular/common/http';
import { DepartmentService } from '../department/department.service';
import { Department } from 'src/app/shared/interfaces/department';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly path = 'http://localhost:3000/products';

  private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
  private loaded: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private deparmentService: DepartmentService
  ) {}

  public get(): Observable<Product[]> {
    if (!this.loaded) {
      combineLatest([
        this.httpClient.get<Product[]>(this.path),
        this.deparmentService.get(),
      ])
        .pipe(
          tap(),
          filter(
            ([products, departments]) => products != null && departments != null
          ),
          map(([products, departments]) => {
            for (let product of products) {
              let ids = product.departments as unknown as string[];
              product.departments = ids.map((id) =>
                departments.find((department) => department._id == id)
              );
            }
            return products;
          }),
          tap((products) => console.log(products))
        )
        .subscribe(this.productsSubject$);

      this.loaded = true;
    }
    return this.productsSubject$.asObservable();
  }

  public create(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[]).map(d => d._id);
    return this.httpClient.post<Product>(this.path, {...prod, departments})
      .pipe(
        tap((p) => {
          this.productsSubject$.getValue()
            .push({...prod, _id: p._id})
        })
      )
  }

  public remove(product: Product): Observable<any> {
    return this.httpClient.delete(`${this.path}/${product._id}`)
      .pipe(
        tap(() => {
          let products = this.productsSubject$.getValue();
          let index = products.findIndex(product => product._id === product._id);
          if (index >= 0)
            products.splice(index, 1);
        })
      )
  }

  public update(product: Product): Observable<Product> {
    let departments = (product.departments as Department[]).map(department => department._id);
    return this.httpClient.patch<Product>(`${this.path}/${product._id}`, {...product, departments})
    .pipe(
      tap(() => {
        let products = this.productsSubject$.getValue();
        let index = products.findIndex(product => product._id === product._id);
        if (index >= 0)
          products[index] = product;
      })
    )
  }
}
