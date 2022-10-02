import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { DepartmentComponent } from './department/department.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProductComponent,
    DepartmentComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ProductComponent,
    DepartmentComponent
  ]
})
export class FeaturesModule { }
