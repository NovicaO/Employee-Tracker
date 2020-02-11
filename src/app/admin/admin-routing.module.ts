import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: AdminPage,
    children: [
      {
        path: 'admin-clock-in',
        loadChildren: () => import('./clock-in-history/clock-in-history.module').then( m => m.ClockInHistoryPageModule)
      },

      {
        path: 'admin-events',
        loadChildren: () => import('./events/events.module').then( m => m.EventsPageModule)
      },
      {
        path: 'admin-users',
        loadChildren: () => import('./employees-administration/employees-administration.module').
        then( m => m.EmployeesAdministrationPageModule)
      },
 
      

    ]
  },



  

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
