import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';


const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: './admin/admin.module#AdminPageModule'
  },
  {
    path: 'employee',
    canActivate: [AuthGuard],
    loadChildren: () => import('./employee/employee.module').then( m => m.EmployeePageModule)
  },
  {
    path: 'edit-event',
    loadChildren: () => import('./shared/event-pick/edit-event/edit-event.module').then( m => m.EditEventPageModule)
  }
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
