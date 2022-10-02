import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {

  readonly path = 'http://localhost:3000/departments';

  private loaded: boolean = false;
  private departmentsSubject$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);

  constructor(private httpClient: HttpClient) {}

  public get(): Observable<Department[]> {
    if (!this.loaded) {
      this.httpClient
        .get<Department[]>(this.path)
        .pipe(
          tap(),
          delay(1000)
        )
        .subscribe(this.departmentsSubject$);
      this.loaded = true;
    }
    return this.departmentsSubject$.asObservable();
  }

  public update(id: string, department: Department): Observable<Department> {
    return this.httpClient.patch<Department>(`${this.path}/${id}`, department)
      .pipe(
        tap((department) => {
          let departments = this.departmentsSubject$.getValue();
          let index = departments.findIndex(department => department._id === department._id);
          if (index >= 0 )
            departments[index].name = department.name;
        })
      )
  }

  public create(department: Department): Observable<Department> {
    return this.httpClient
      .post<Department>(this.path, department)
      .pipe(
        tap((department: Department) =>
          this.departmentsSubject$.getValue().push(department)
        )
      );
  }

  public remove(department: Department): Observable<any> {
    return this.httpClient.delete(`${this.path}/${department._id}`).pipe(
      tap(() => {
        let departments = this.departmentsSubject$.getValue();
        let index = departments.findIndex((department) => department._id === department._id);
        if (index >= 0) departments.splice(index, 1);
      })
    );
  }
}
