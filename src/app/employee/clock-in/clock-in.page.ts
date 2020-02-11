import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ClockInService } from './clock-in.service';
import { Data } from './data.model';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-clock-in',
  templateUrl: './clock-in.page.html',
  styleUrls: ['./clock-in.page.scss'],
})
export class ClockInPage implements OnInit, AfterViewInit {
  private date: Date = new Date();
  private currentDate;
  @ViewChild('date', {static: false}) component;
  clockInData: Data;
  constructor(private clockInService: ClockInService) { }

  ngOnInit() {

  }

  // getLocation(){
  //   console.log('hey');
  //   this.clockInService.getCurrentPosition();
  // }

  ngAfterViewInit(){

  //   this.component.ionChange.subscribe(data =>{
  //     console.log(data.detail.value);
  //     console.log()
  //     let cd = new Date(data.detail.value);
  //     this.currentDate = cd.getFullYear() + '-' + (cd.getMonth() + 1) + '-' + cd.getDate();
  //     this.clockInService.getSingleDataForUser(this.currentDate).pipe(take(1)).subscribe(data=>{
  //       this.clockInService.data = data;
  //       this.clockInData = data;
  //     });

  // });
  }

}
