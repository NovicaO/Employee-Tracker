import { Component, OnInit, Injectable } from '@angular/core';


import {take} from 'rxjs/operators';
import { Plugins, Capacitor, Device } from '@capacitor/core';
import { Data } from './data.model';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastController } from '@ionic/angular';

const { Geolocation } = Plugins;
interface returnData{
  results: {
    formatted_address
  }
}

@Injectable({
  providedIn: 'root'
})


export class ClockInService {
  private toastCtrl: ToastController;
  public singleData = new Subject<Data>();
  public clockInData = new Subject<Data[]>();
  public globalDate = new Subject<Date>();
  public clockInButton = new Subject<boolean>();
  public displayErrorMessage = new Subject<string>();
  //switching from clock in info to clock out info on the administration clock in page and maps!
  public switchButton = new Subject<boolean>();

  data: Data;
  datum = new Date();
  fullDate = this.datum.getFullYear() + '-' + (this.datum.getMonth() + 1) + '-' + this.datum.getDate();
  user: User;

  constructor(
    private http: HttpClient,
    private authUser: AuthService,
    private fireb: AngularFireDatabase
  ) {
    }
  //switching between clock in and clock out data at administration clock in page
  emitSwitch(cond){
    this.switchButton.next(cond);
  }

  emitError(err){
    this.displayErrorMessage.next(err);
  }
  
  emitButton(cond){
    this.clockInButton.next(cond);
  }

  emitSingleData(data) {
    this.singleData.next(data);
  }
  emitGlobalDate(datum) {
    this.globalDate.next(datum);
  }

  emitClockInData(data){
    this.clockInData.next(data);
  }




  currentId;
  async getCurrentPosition() {
    const info = await Device.getInfo();
    if(info.uuid != this.authUser.user.deviceId){
      console.log(info.uuid);
      console.log(this.authUser.user.deviceId);
      this.displayErrorMessage.next('You are NOT using the device you registered your account with!');
      return;
    }
    
    this.emitButton(true);
    try{ 
      const geoPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy : true,
        maximumAge: 0,
        requireAltitude: false
      });
      
      let data: Data = {startLat: geoPosition.coords.latitude, startLng: geoPosition.coords.longitude, startTime: new Date(geoPosition.timestamp).toLocaleString(), userId: this.authUser.user.uid, clockedIn: true, userName: this.authUser.user.firstName + ' ' + this.authUser.user.lastName, accuracyIn: geoPosition.coords.accuracy, speedIn: geoPosition.coords.speed  };
      this.emitSingleData(data);
      this.data = data;

  
      let datum = new Date(geoPosition.timestamp);

      this.fullDate = datum.getFullYear() + '-' + (datum.getMonth() + 1) + '-' + datum.getDate();
      let hours = datum.getHours()+':'+datum.getMinutes()+':'+datum.getSeconds();
      let id = this.fireb.createPushId();
      this.currentId = id;
      this.fireb.object(`clock-in/${this.fullDate}/${this.authUser.user.uid}/${id}`).set(data).then(value => {
    
    
        this.emitButton(false);
      }).catch(reason =>{
        console.log(reason);
        
      });
    } catch(error){
      if(error.message == 'User denied Geolocation'){
        this.emitButton(false);
        this.displayErrorMessage.next('You denied access to internet, go to settings and allow it again!');
      }else{
        this.emitButton(false);
      }
    }


  
  }



  async getCurrentPositionOut(data) {
    const info = await Device.getInfo();
    
    if(info.uuid != this.authUser.user.deviceId){
      console.log(info.uuid);
      console.log(this.authUser.user.deviceId);
      this.displayErrorMessage.next('You are NOT using the device you registered your account with!');
 
      return;
    }
    let id;
    let datum;

    this.emitButton(true);
    if(!this.currentId){
      id = data.id;
      datum = this.getFullDateFormat(new Date(data.datum));
    }else{
      datum = this.getFullDateFormat(new Date());
      id = this.currentId;
    }
    this.getSpecificData(datum, id).pipe(take(1)).subscribe(async data => {
    this.data = data;
    if(!data){
      return;
    }

    if(!Capacitor.isPluginAvailable('Geolocation')) {
      return;
    }
    
    const geoPosition = await Geolocation.getCurrentPosition({
      enableHighAccuracy : true,
      maximumAge: 0,
      requireAltitude: false
    });
    this.data.endTime = new Date(geoPosition.timestamp).toLocaleString();
    this.data.endLat = geoPosition.coords.latitude;
    this.data.endLng = geoPosition.coords.longitude;
    this.data.accuracyOut = geoPosition.coords.accuracy;
    this.data.speedOut = geoPosition.coords.speed;
    this.data.clockedIn = false;
    let total = this.calculateWorkHours();

    this.data.totalHours = total.h + ':' + total.m + ':' + total.s;
    this.emitSingleData(this.data);
    this.fireb.object(`clock-in/${datum}/${this.authUser.user.uid}/${id}`).set(this.data).then(value =>{
      this.currentId = '';
      this.emitButton(false);
    });
    });

  }

  // watchPosition() {
  //   const wait = Geolocation.watchPosition({}, (position, err) => {
  //   })
  // }

  // clockIn() {
  //   if(!Capacitor.isPluginAvailable('Geolocation')) {
  //     console.log('Could not fetch location');
  //     return;
  //   }
  //   Plugins.Geolocation.getCurrentPosition().then(geoPosition =>{
  //     this.getAddress(geoPosition.coords.latitude, geoPosition.coords.longitude).pipe(take(1)).subscribe(information => {

  //       let ca = information.results[0].formatted_address;
  //       let data: Data = {startLat: geoPosition.coords.latitude, startLng: geoPosition.coords.longitude, startTime: new Date(geoPosition.timestamp).toLocaleString(), userId: this.authUser.user.uid, clockedIn: true, startAddress: ca, userName: this.authUser.user.firstName + ' ' + this.authUser.user.lastName  };
  //       this.emitSingleData(data);
  //       this.data = data;


  //       let datum = new Date(geoPosition.timestamp);

  //       this.fullDate = datum.getFullYear() + '-' + (datum.getMonth() + 1) + '-' + datum.getDate();
  //       let hours = datum.getHours()+':'+datum.getMinutes()+':'+datum.getSeconds();
  //       this.fireb.object(`clock-in/${this.fullDate}/${this.authUser.user.uid}/${hours}`).set(data);
  //     });


  //   });
 
  // }
  
  // clockOut(){
  //   let key;
  //   this.getSingleData().pipe(take(1)).subscribe(data => {
  //     key = Object.keys(data)[0];
  //     this.data = Object.values(data)[0];
  //     if(!this.data) {
  //       return;
  //     }
  //     if(!Capacitor.isPluginAvailable('Geolocation')) {
  //       console.log('Could not fetch location');
  //       return;
  //     }
  //     Plugins.Geolocation.getCurrentPosition().then(geoPosition =>{
  
  //       this.getAddress(geoPosition.coords.latitude, geoPosition.coords.longitude).pipe(take(1)).subscribe(information => {
  //         this.data.endTime = new Date().toLocaleString();
  //         this.data.endLat = geoPosition.coords.latitude;
  //         this.data.endLng = geoPosition.coords.longitude;
  //         this.data.endAddress = information.results[0].formatted_address;
  
  //         let total = this.calculateWorkHours();
      
  //         this.data.totalHours = total.h + ':' + total.m + ':' + total.s;
  //         this.emitSingleData(this.data);
  //         let datum = new Date(geoPosition.timestamp);
  //         this.fullDate = datum.getFullYear() + '-' + (datum.getMonth() + 1) + '-' + datum.getDate();
  //         this.fireb.object(`clock-in/${this.fullDate}/${this.authUser.user.uid}/${key}`).set(this.data);
  
  //       });
   
  //     });
  //   });

  // }


  calculateWorkHours() {
    let startDate = new Date(this.data.startTime);
    let endDate = new Date(this.data.endTime);

    // get total seconds between the times
    let delta = Math.abs(startDate.getTime() - endDate.getTime()) / 1000;

    // calculate (and subtract) whole days
    // let days = Math.floor(delta / 86400);
    // delta -= days * 86400;

    // calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600);
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    let seconds = delta % 60;  // in theory the modulus is not required

    let s = seconds.toString();
    let h = hours.toString();
    let m = minutes.toString();
    if(seconds < 10){
      s = "0" + s;
    }
    if(minutes < 10){
      m = "0" + m;
    }
    if(hours < 10){
      h = "0" + h;
    }

    console.log(h, m, s);
    return {h: h, m: m, s: s}
  }


  getLatestClockInForDay(date){
    this.getDataForSpecificDay(date).pipe(take(1)).subscribe( data => {
      this.emitClockInData(data);
    });
  }

  getAddress(lat, long){
    return this.http.get<returnData>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCgWD6kj33gXXJOVWQQT4alNxJ1LNj5txM`);
 }

 getConfig() {
   return this.http.get(`https://westparkexpress-910c4.firebaseio.com/config.json?auth=${this.authUser.user.tokenId}`);


} 

  getData() {
    return this.http.get<Data[]>(`https://westparkexpress-910c4.firebaseio.com/clock-in.json?auth=${this.authUser.user.tokenId}`);
  }
  getDataForDay(){
    return this.http.get<Data[]>(`https://westparkexpress-910c4.firebaseio.com/clock-in/${this.fullDate}.json?auth=${this.authUser.user.tokenId}`);
  }

  getDataForSpecificDay(date){
    return this.http.get<Data[]>(`https://westparkexpress-910c4.firebaseio.com/clock-in/${date}.json?auth=${this.authUser.user.tokenId}`);
  }
  getSingleDataForUser(date){
    return this.http.get<Data>(`https://westparkexpress-910c4.firebaseio.com/clock-in/${date}/${this.authUser.user.uid}.json?auth=${this.authUser.user.tokenId}`);
  }

  getSingleData() {
    return this.http.get<Data>(`https://westparkexpress-910c4.firebaseio.com/clock-in/${this.fullDate}/${this.authUser.user.uid}.json?orderBy="$key"&limitToLast=1&auth=${this.authUser.user.tokenId}`);
  }

  getSpecificData(datum, id) {
    return this.http.get<Data>(`https://westparkexpress-910c4.firebaseio.com/clock-in/${datum}/${this.authUser.user.uid}/${id}.json?auth=${this.authUser.user.tokenId}`);
  }
  getSingleDataYesterday() {
    let newDate = new Date().setDate(new Date().getDate() - 1);
    let yesterday = this.getFullDateFormat(new Date(newDate));
    return this.http.get<Data>(`https://westparkexpress-910c4.firebaseio.com/clock-in/${yesterday}/${this.authUser.user.uid}.json?orderBy="$key"&limitToLast=1&auth=${this.authUser.user.tokenId}`);
  }





  getLastSevenDays(datum, uid) {
    return this.http.get<Data>(`https://westparkexpress-910c4.firebaseio.com/clock-in/${datum}/${uid}.json?auth=${this.authUser.user.tokenId}`);
  }



  getFullDateFormat(datum: Date){
    return datum.getFullYear() + '-' + (datum.getMonth() + 1) + '-' + datum.getDate();
  }









  //this needs seperate service

  listOfObservables: Observable<any>[] = [];
  listOfObjects:Data[] = [];
  public printObjects = [];
  getLastSevenDaysFunction(uid){
    this.printObjects = [];
    this.listOfObjects = [];
    this.listOfObservables = [];
    let datum = new Date();
    datum.setDate(datum.getDate() + 1)
    for(let i = 0; i<=7; i++){
      datum.setDate(datum.getDate() - 1);
      let formatted = this.getFullDateFormat(datum);
      let data = this.getLastSevenDays(formatted, uid);
      this.listOfObservables.push(data);
    }

    this.listOfObservables.forEach(element => {
      element.pipe(take(1)).subscribe(data =>{
          if(data){
            for(let key in data){
              this.listOfObjects.push(data[key]);
            }
            
          }
      });
 
    });


    setTimeout(() => {
        this.listOfObjects.forEach(o =>{
            // let getFullDate = this.getFullDateFormat(new Date(o.startTime));
            // let newDate = new Date(o.startTime);
            // let hours = newDate.getHours() +':'+newDate.getMinutes() + ':' + newDate.getSeconds();
            // if(!this.printObjects[getFullDate]){
            //   this.printObjects[getFullDate] = [];
            // }
            this.printObjects.push({startTime: o.startTime, endTime: o.endTime, totalHours: o.totalHours});
        });
        console.log(this.printObjects);
    }, 1000);
  }

}
  




  // clockIn() {
  //   if(!Capacitor.isPluginAvailable('Geolocation')) {
  //     console.log('Could not fetch location');
  //     return;
  //   }
  //   Plugins.Geolocation.getCurrentPosition().then(geoPosition =>{
  //     console.log(geoPosition);
  //     this.getAddress(geoPosition.coords.latitude, geoPosition.coords.longitude).pipe(take(1)).subscribe(information => {
  //       console.log(information);
  //       let ca = information.results[0].formatted_address;
  //       let data: Data = {startLat: geoPosition.coords.latitude, startLng: geoPosition.coords.longitude, startTime: new Date().toLocaleString(), userId: this.authUser.user.uid, clockedIn: true, startAddress: ca, userName: this.authUser.user.firstName + ' ' + this.authUser.user.lastName  };
  //       this.emitSingleData(data);
  //       this.data = data;
  //       this.fireb.object(`clock-in/${this.fullDate}/${this.authUser.user.uid}`).set(data);
  //     });


  //   });
 
  // }

  
  // clockOut(){
  //   this.getSingleData().pipe(take(1)).subscribe(data =>{
  //     this.data = data;
  //   });
  //   if(!this.data){
  //     return; 
  //   }
  //   if(!Capacitor.isPluginAvailable('Geolocation')) {
  //     console.log('Could not fetch location');
  //     return;
  //   }
  //   Plugins.Geolocation.getCurrentPosition().then(geoPosition =>{

  //     this.getAddress(geoPosition.coords.latitude, geoPosition.coords.longitude).pipe(take(1)).subscribe(information => {
  //       console.log(this.data);
  //       this.data.endTime = new Date().toLocaleString();
  //       this.data.endLat = geoPosition.coords.latitude;
  //       this.data.endLng = geoPosition.coords.longitude;
  //       this.data.endAddress = information.results[0].formatted_address;

  //       let total = this.calculateWorkHours();
    
  //       this.data.totalHours = total.h + ':' + total.m + ':' + total.s;
  //       this.emitSingleData(this.data);
  //       this.fireb.object(`clock-in/${this.fullDate}/${this.authUser.user.uid}`).set(this.data);

  //     });
 
  //   });

  // }
