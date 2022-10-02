import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department';
import { DepartmentService } from './department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  public form!: FormGroup;
  public department: Department | undefined;
  public departments: Department[] = [];

  private unsubscribeNotifier = new Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.createform();
    this.loadDepartements();
  }

  ngOndestroy(): void {
    this.unsubscribeNotifier.next();
  }

  public createform(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]]
    })
  }

  public save() {
    if (this.department) {
      this.update();
    } else {
      this.create();
    }
  }

  public create() {
    this.departmentService.create(this.form.value).pipe(
      takeUntil(this.unsubscribeNotifier)
    ).subscribe({
      next: () => {
        this.form.reset();
        this.snackBar.open(
          'Departamento cadastrado com sucesso! ', 'OK',
          { duration: 2000 });
      },
      error: () => {
        this.snackBar.open(
          'Erro ao cadastrar departamento! ', 'OK',
          { duration: 2000 });
      }
    });
  }

  public update() {
    this.departmentService.update(this.department._id, this.form.value).pipe(
      takeUntil(this.unsubscribeNotifier),
    ).subscribe({
      next: () => {
        this.snackBar.open(
          'Departamento atualizado com sucesso! ', 'OK',
          { duration: 2000 });
      },
      error: error => {
        this.snackBar.open(
          'Erro ao atualizar departamento! ', 'OK',
          { duration: 2000 });
      }
    });
  }

  public loadDepartements() {
    this.departmentService.get().pipe(
      takeUntil(this.unsubscribeNotifier)
      ).subscribe(department => {
          this.departments = department;
      });
  }

  public cancel(){
    this.form.reset();
  }

  public delete(department: Department) {
    this.departmentService.remove(department)
      .subscribe({
          next: () => {
            this.snackBar.open(
              'Departamento deletado com sucesso! ', 'OK',
              { duration: 2000 });
          },
          error: () => {
            this.snackBar.open(
              'Erro ao deletar departamento! ', 'OK',
              { duration: 2000 });
          }
      })
  }

  public edit(department: Department) {
    this.form.get('name')?.patchValue(department.name)
    this.department = department;
  }

}
