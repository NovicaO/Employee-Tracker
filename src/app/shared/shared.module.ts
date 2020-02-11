import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; 

import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { EventPickComponent } from './event-pick/event-pick.component';
import { FormsModule } from '@angular/forms';
import { NgCalendarModule } from 'ionic2-calendar';


@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent, EventPickComponent],
  imports: [CommonModule, IonicModule, FormsModule, NgCalendarModule],
  exports: [LocationPickerComponent, MapModalComponent, EventPickComponent],
  entryComponents: [MapModalComponent]
})
export class SharedModule {}
