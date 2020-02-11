import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Data } from 'src/app/employee/clock-in/data.model';
import { ClockInService } from 'src/app/employee/clock-in/clock-in.service';
import { AuthService } from 'src/app/auth/auth.service';



@Component({
  selector: 'app-clock-in-history',
  templateUrl: './clock-in-history.page.html',
  styleUrls: ['./clock-in-history.page.scss'],
})
export class ClockInHistoryPage implements OnInit, AfterViewInit {

  private date: Date = new Date();
  private currentDate;
  clockInData: Data[] = [];
  @ViewChild('date', {static: false}) component;

  //switching from clock in to clock out information!
  public switchButton = true;

  constructor(private clockInService: ClockInService, private authService: AuthService) {}


  ngOnInit() {
    this.currentDate = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate();
    this.getAddressHistory();
    this.clockInService.clockInData.subscribe( data => {
      this.clockInData = [];
      for (let k in data) {
        if (data.hasOwnProperty(k)) {
          for(let j in data[k]){
            this.clockInData.push(data[k][j]);
          }
        }
      }
  });
}
ngAfterViewInit() {

  this.component.ionChange.subscribe(data =>{
    let cd = new Date(data.detail.value);
    this.currentDate = cd.getFullYear() + '-' + (cd.getMonth() + 1) + '-' + cd.getDate();
    this.clockInService.emitGlobalDate(this.currentDate);
    this.getAddressHistory();
  });

}


getAddressHistory() {
  this.clockInService.getLatestClockInForDay(this.currentDate);
}
getAddressHistoryRefresh(event) {
  setTimeout(() => {
    event.target.complete();
  }, 2000);
  this.clockInService.getLatestClockInForDay(this.currentDate);
}

getInfo(user){
  this.authService.selectedUser = user;
}

switch(){
  this.switchButton = !this.switchButton;
  this.clockInService.emitSwitch(this.switchButton);
}

}
