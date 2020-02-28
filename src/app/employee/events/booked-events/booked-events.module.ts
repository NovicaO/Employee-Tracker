import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookedEventsPageRoutingModule } from './booked-events-routing.module';

import { BookedEventsPage } from './booked-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookedEventsPageRoutingModule
  ],
  declarations: [BookedEventsPage]
})
export class BookedEventsPageModule {}
