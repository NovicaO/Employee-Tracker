import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeesAdministrationPage } from './employees-administration.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeesAdministrationPage
  },
  {
    path: 'employee-detail',
    loadChildren: () => import('./employee-detail/employee-detail.module').then( m => m.EmployeeDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesAdministrationPageRoutingModule {}
