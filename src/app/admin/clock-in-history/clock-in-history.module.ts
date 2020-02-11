import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClockInHistoryPageRoutingModule } from './clock-in-history-routing.module';

import { ClockInHistoryPage } from './clock-in-history.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockInHistoryPageRoutingModule,
    SharedModule
  ],
  declarations: [ClockInHistoryPage]
})
export class ClockInHistoryPageModule {}
