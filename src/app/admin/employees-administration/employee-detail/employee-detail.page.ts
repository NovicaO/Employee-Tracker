import { Component, OnInit } from '@angular/core';
import { ClockInService } from 'src/app/employee/clock-in/clock-in.service';
import { Data } from 'src/app/employee/clock-in/data.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit {

  constructor(private clockInService: ClockInService, public loadingCtrl: LoadingController) { }
  printObjects = [];
  ngOnInit() {
    this.presentLoading();
    setTimeout(() => {
      this.printObjects = this.clockInService.printObjects;
    }, 1000);
  }

  loading;
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait',
      mode: 'ios', 
      duration: 1000
    });
    await this.loading.present();
  }  



}
