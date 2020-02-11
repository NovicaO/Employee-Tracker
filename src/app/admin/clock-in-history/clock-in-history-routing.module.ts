import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClockInHistoryPage } from './clock-in-history.page';

const routes: Routes = [
  {
    path: '',
    component: ClockInHistoryPage
  },
  {
    path: 'detail/:userId',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockInHistoryPageRoutingModule {}
