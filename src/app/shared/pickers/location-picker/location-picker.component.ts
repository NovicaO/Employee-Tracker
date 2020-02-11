import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MapModalComponent } from '../../map-modal/map-modal.component';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { ClockInService } from 'src/app/employee/clock-in/clock-in.service';
import { Data } from 'src/app/employee/clock-in/data.model';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  disableButton = false;
  data: Data;
  isClockedIn = false;
  datum = new Date();
  fullDate = this.datum.getFullYear() + '-' + (this.datum.getMonth() + 1) + '-' + this.datum.getDate();
  user: User;
  @ViewChild('clockInButton', {static: false}) clockInButton;


  constructor(
     private modalCtrl: ModalController,
     private authUser: AuthService,
     private clockInService: ClockInService) {}

 
  showStartLatLng;
  currentData;
  ngOnInit() {
    this.disableButton = true;
    this.clockInService.switchButton.subscribe( cond =>{
      this.showStartLatLng = cond;
  });
    this.user = this.authUser.user;


    this.clockInService.clockInButton.subscribe(value =>{
      this.disableButton = value;
    });

    this.clockInService.getSingleDataYesterday().pipe(take(1)).subscribe( i => {
      if(i){
        let ob = i[Object.keys(i)[0]];
        if (ob && !ob.endTime) {
        
          this.currentData = {id: Object.keys(i)[0], datum: ob.startTime};
          this.isClockedIn = true;
        } else {
          this.isClockedIn = false;
        }
      }

      if(!this.isClockedIn){
        console.log('prolazim');
        this.clockInService.getSingleData().pipe(take(1)).subscribe( inf => {
          if(inf){
            let obj = inf[Object.keys(inf)[0]];
            console.log(obj);
            if (obj && !obj.endTime) {
              this.currentData = {id: Object.keys(inf)[0], datum: obj.startTime};
              this.isClockedIn = true;
            } else {
              this.isClockedIn = false;
            }
          }
        });
      }

      this.clockInService.clockInButton.next(false);
    });

    //waits for data after clock in
    this.clockInService.singleData.subscribe(value => {
      if (!value.endTime) {
        this.isClockedIn = true;
      } else {
        this.isClockedIn = false;
      }
    });
  }

 // DONT FORGET TO CLEAN UP SUBSCRIPTIONS! 

  onPickLocation() {
    this.modalCtrl.create({ component: MapModalComponent,
      componentProps: {
        passData: this.showStartLatLng
      } }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        console.log(modalData.data);
      });
      modalEl.present();
    });
  }

  clockIn() {
    this.clockInService.clockIn();
  }

  clockOut() {
    this.clockInService.clockOut();
  }
  

  newClockIn(){
   this.clockInService.getCurrentPosition();

  }
  newClockOut(){
    this.clockInService.getCurrentPositionOut(this.currentData);
  }
  



}

//api key 
//AIzaSyCgWD6kj33gXXJOVWQQT4alNxJ1LNj5txM