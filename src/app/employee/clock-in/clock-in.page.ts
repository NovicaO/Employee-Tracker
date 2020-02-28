import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ClockInService } from './clock-in.service';
import { Data } from './data.model';
import { take } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-clock-in',
  templateUrl: './clock-in.page.html',
  styleUrls: ['./clock-in.page.scss'],
})
export class ClockInPage implements OnInit, AfterViewInit {
  private date: Date = new Date();
  private currentDate;
  @ViewChild('date', {static: false}) component;
  clockInData: Data[] = [];
  configData: any = {config_calendar_view: false, config_history_view: false};

  
  constructor(private clockInService: ClockInService, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.clockInService.displayErrorMessage.subscribe(err =>{
      this.presentToast(err);
  });
  }


  async presentToast(information: string) {
    const toast = await this.toastCtrl.create({
      message: information,
      duration: 2000
    });
    toast.present();
  }

  ngAfterViewInit(){

      this.component.ionChange.subscribe(data =>{
        this.clockInData = [];
        let cd = new Date(data.detail.value);
        this.currentDate = cd.getFullYear() + '-' + (cd.getMonth() + 1) + '-' + cd.getDate();
        this.clockInService.getSingleDataForUser(this.currentDate).pipe(take(1)).subscribe(data=>{
          // this.clockInService.data = data;
          // this.clockInData = data;
          for (let k in data) {
            if (data.hasOwnProperty(k)) {
              this.clockInData.push(data[k]);
              // for(let j in data[k]){
              // }
            }
          }
        });
    
    });
    this.clockInService.getConfig().subscribe(data =>{
      this.configData = data;
    });
  }

}
