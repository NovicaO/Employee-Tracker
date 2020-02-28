import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookedEventsPage } from './booked-events.page';

const routes: Routes = [
  {
    path: '',
    component: BookedEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookedEventsPageRoutingModule {}
