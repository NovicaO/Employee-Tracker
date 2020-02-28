import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Data } from '../employee/clock-in/data.model';
import { Plugins, Storage, Device } from '@capacitor/core';
import { ToastController, AlertController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
   user = {} as User;
   users = [];
   selectedUser: Data;
  constructor(
    private authF: AngularFireAuth,
    private router: Router, private fireb: AngularFireDatabase,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private http: HttpClient,
    public alertController: AlertController) { }


 

  async login(user: User) {
    try{
      let uname =user.email.replace(/ /g, '');
      console.log(uname);
      const u = await (await this.authF.auth.signInWithEmailAndPassword(uname, user.password));
      let ti = (await u.user.getIdTokenResult()).token;
      let et = (await u.user.getIdTokenResult()).expirationTime;
      let expirationTime = new Date(et);
      this.user = {uid: u.user.uid, email: u.user.email, expiresIn: expirationTime, tokenId: ti};
      this.getProfileInfo(u.user.uid, ti).pipe(take(1)).subscribe( data => {
      this.user.firstName = data.firstName;
      this.user.lastName = data.lastName;
      this.user.phone = data.phone;
      this.user.isAdmin = data.isAdmin;
      this.user.isActivated = data.isActivated;
      this.user.canSeeCalendar = data.canSeeCalendar;
      this.user.deviceId = data.deviceId;
      if(!data.isActivated){
        this.authF.auth.signOut();
        this.presentToast('Waiting for admin to approve your account!');
        return;
      }

      this.autoLogout(this.tokenDuration());
      // this.setObject(data.email, data.password, et, ti, u.user.uid);
      if (this.user.uid) {
        if (this.user.isAdmin) {
          this.router.navigate(['/admin/tabs/admin-clock-in']);
        } else {
          this.router.navigate(['/employee/tabs/e-clock-in']);
        }
      }
    });
 
    } catch (e) {
        if(e.code === 'auth/user-not-found'){
          this.presentToast('User not found');
        }else if(e.code === 'auth/wrong-password'){
          this.presentToast('Wrong password');
        }else{
          this.presentToast('Invalid credentials');
        }
    }
  }

  async presentToast(information: string) {
    const toast = await this.toastCtrl.create({
      message: information,
      duration: 2000
    });
    toast.present();
  }

  async register(user: User){
      const info = await Device.getInfo();
      let uname =user.email.replace(/ /g, '');
      const result = await this.authF.auth.createUserWithEmailAndPassword(uname, user.password);
      this.createProfile(user, result.user.uid, info.uuid);
  }

  async logout() {
    if(this.timerClockOut){
      clearTimeout(this.timerClockOut);
    }
    const alert = await this.alertController.create({
      header: 'Logging out',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //handle this
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.authF.auth.signOut().then( () => {
              this.user = null;
              this.router.navigateByUrl('/auth');
            });
        
          }
        }
      ]
    });
    await alert.present();
  }

  instantLogout(){
    this.authF.auth.signOut().then( () => {
      this.user = null;
      this.router.navigateByUrl('/auth');
    });
  }

  async setObject(email, password, expirationDate, token, uid) {
    // await Storage.set({
    //   key: 'email',
    //   value: email
    // });
    // await Storage.set({
    //   key: 'password',
    //   value: password
    // });
    // let data =  JSON.stringify({
    //   email, password, expirationDate, token, uid
    // }); 
    // await Storage.set({
    //   key: 'data',
    //   value: data
    // });

  }




  createProfile(user: User, uid:string, deviceId: string) {
    user.isAdmin = false;
    user.isActivated = false;
    user.canSeeCalendar = false;
    user.deviceId = deviceId;
    this.fireb.object(`profile/${uid}`).set(user);
  }

   getProfileInfo(uid, ti) {
     return this.http.get<User>(`https://westparkexpress-910c4.firebaseio.com/profile/${uid}.json?auth=${ti}`);
   }

  getProfiles(){
    return this.http.get<User[]>(`https://westparkexpress-910c4.firebaseio.com/profile.json?auth=${this.user.tokenId}`);
  }


  timerClockOut: any;
  autoLogout(duration){
    if(this.timerClockOut){
      clearTimeout(this.timerClockOut);
    }
    setTimeout(() => {
      this.instantLogout();
      this.presentToast('Session expired, please log in again');
    }, duration);
  }


  tokenDuration(){
    if(!this.user.tokenId){
      return 0;
    }
    return  this.user.expiresIn.getTime() - new Date().getTime();
  }
}
