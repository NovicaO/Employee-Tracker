import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';


const { Storage } = Plugins;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, AfterViewInit {

  isLogin = true;
  user = {} as User;
  constructor(private authService: AuthService, private router: Router, private alertCtrl: AlertController, private toastCtrl: ToastController, public loadingCtrl: LoadingController) { 
    let email = Storage.get({key:'email'}).then(val =>{
      this.user.email = val.value;
    });
    let password = Storage.get({key:'password'}).then(val =>{
      this.user.password = val.value;
    });

  }



  ngOnInit() {
  }

   ngAfterViewInit() {



  }

  switchMode() {
    this.isLogin = !this.isLogin;
  }

  login(user: User) {
    this.presentLoading();
    this.authService.login(user).then(u => {
    
    // this.authService.getProfileInfo(u.user.uid).pipe(take(1)).subscribe( data => {
    //   console.log('ulazim');
    //   this.authService.user.firstName = data.firstName;
    //   this.authService.user.lastName = data.lastName;
    //   this.authService.user.phone = data.phone;
    //   this.authService.user.isAdmin = data.isAdmin;
    //   this.authService.user.isActivated = data.isActivated;
    //   this.authService.user.canSeeCalendar = data.canSeeCalendar;
    //   if(!data.isActivated){
    //     this.presentToast('Waiting for admin to approve your account!');
    //     return;
    //   }

      
      this.setObject(user.email, user.password);
    //   if (this.authService.user.uid) {
    //     if (this.authService.user.isAdmin) {
    //       this.router.navigate(['/admin/tabs/admin-clock-in']);
    //     } else {
    //       this.router.navigate(['/employee/tabs/e-clock-in']);
    //     }
    //   }
    // });
    this.loading.dismiss();
    }).catch(e =>{
        if(!this.loading){
          setTimeout(() => {
          if(this.loading){
            this.loading.dismiss();
          }
          }, 1000);
        }        
        this.presentToast('Invalid login credentials!');
    });

  }
   register(user: User){
     this.authService.register(user);
     this.presentToast('Successfuly created your account!');
     this.switchMode();
  }

  logout() {

  }
  async presentToast(information: string) {
    const toast = await this.toastCtrl.create({
      message: information,
      duration: 2000
    });
    toast.present();
  }
  async setObject(email, password) {
    await Storage.set({
      key: 'email',
      value: email
    });
    await Storage.set({
      key: 'password',
      value: password
    });
  }
 
  
  // async autoLogin() {
  //   console.log('autoLogin');
  //   const { value } = await Storage.get({ key: 'data' });
  //   if(!value){
  //     return;
  //   }
  //   const parsedData = JSON.parse(value) as {email: string, password: string, expirationDate: Date, token: string, uid: string}
    
  //   const expirationD = new Date(parsedData.expirationDate);
    
  //   if(expirationD <= new Date()){
  //     return;
  //   }

  //   this.authService.user.email = parsedData.email;
  //   this.authService.user.password = parsedData.password;
  //   this.authService.user.expiresIn = parsedData.expirationDate;
  //   this.authService.user.tokenId = parsedData.token;
  //   this.authService.user.uid = parsedData.uid;
    
  //   this.router.navigate(['/employee/tabs/e-clock-in']);
  // }




  loading;
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait',
      mode: 'ios'
    });
    await this.loading.present();
  }  

}