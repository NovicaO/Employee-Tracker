import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';
import { User } from 'src/app/auth/user.model';
import { ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { ClockInService } from 'src/app/employee/clock-in/clock-in.service';
import { EmployeeDetailPage } from './employee-detail/employee-detail.page';

@Component({
  selector: 'app-employees-administration',
  templateUrl: './employees-administration.page.html',
  styleUrls: ['./employees-administration.page.scss'],
})
export class EmployeesAdministrationPage implements OnInit {
  users: User[] = [];
  constructor(private authService: AuthService, private toastCtrl: ToastController, private fireb: AngularFireDatabase, private clockInService: ClockInService) {

   }

  ngOnInit() {
    this.authService.getProfiles().pipe(take(1)).subscribe(users =>{
      console.log(users);
      for(let k in users) {
        if (users.hasOwnProperty(k)) {
         users[k].uid = k;
         this.users.push(users[k]);
        }
      }
    });
  }



  updateIsActivated(event, uid){

    // this.presentToast(event.detail.checked? 'User is enabled': 'User is disabled');
    this.fireb.object(`profile/`+ uid +'/isActivated').set(event.detail.checked);

  }

  updateCanSeeCalendar(event, uid){
    this.fireb.object(`profile/`+ uid +'/canSeeCalendar').set(event.detail.checked);
  }



  async presentToast(information: string) {
    const toast = await this.toastCtrl.create({
      message: information,
      duration: 2000
    });
    toast.present();
  }

  getLastSevenDays(uid){
    this.clockInService.getLastSevenDaysFunction(uid);
  }
}
