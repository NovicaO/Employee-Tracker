import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeePage } from './employee.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: EmployeePage,
    children: [
      {
        path: 'e-clock-in',
        loadChildren: () => import('./clock-in/clock-in.module').then( m => m.ClockInPageModule)
      },

      {
        path: 'e-events',
        loadChildren: () => import('./events/events.module').then( m => m.EventsPageModule)
      },
      // {
      //   path: 'admin-users',
      //   loadChildren: './employees-administration/employees-administration.module#EmployeesAdministrationPageModule'
      // }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeePageRoutingModule {}
