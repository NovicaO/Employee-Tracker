import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeesAdministrationPageRoutingModule } from './employees-administration-routing.module';

import { EmployeesAdministrationPage } from './employees-administration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeesAdministrationPageRoutingModule
  ],
  declarations: [EmployeesAdministrationPage]
})
export class EmployeesAdministrationPageModule {}
