import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeePageRoutingModule } from './employee-routing.module';

import { EmployeePage } from './employee.page';
import { SharedModule } from '../shared/shared.module';
import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeePageRoutingModule,
    SharedModule
  ],
  declarations: [EmployeePage]
})
export class EmployeePageModule {}
