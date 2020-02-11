import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID, AfterViewInit } from '@angular/core';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Event } from './event.model';
import { EditEventPage } from './edit-event/edit-event.page';
import {take} from 'rxjs/operators';
@Component({
  selector: 'app-event-pick',
  templateUrl: './event-pick.component.html',
  styleUrls: ['./event-pick.component.scss'],
})
export class EventPickComponent implements OnInit {

  event = {
    id: '',
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false,
    employees: []
  };
 
  minDate = new Date().toISOString();
 
  eventSource = [];
  viewTitle;
  eventSourceSubject = new Subject<Event>();
 
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
 
  @ViewChild(CalendarComponent, {static: true } ) myCal: CalendarComponent;
  user: User;
  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string, private http: HttpClient,
  private fireb: AngularFireDatabase, private authService: AuthService, private toastCtrl: ToastController, 
  public modalController: ModalController) { }


  loadEvents(){
    this.eventSource = [];
    this.getData().pipe(take(1)).subscribe(data =>{
      for (let k in data) {
        if (data.hasOwnProperty(k)) {

        for(let s in data[k]){
          if(data[k].hasOwnProperty(s)){
            if(s === 'startTime'){
              data[k].startTime = new Date(data[k].startTime);
            }
            if(s === 'endTime'){
            
              data[k].endTime = new Date(data[k].endTime);
            }
  
          }
        }
        this.eventSource.push(data[k]);
        }
      }
      this.myCal.loadEvents();
    });
    this.resetEvent();
  }

 


  ngOnInit() {
    this.getData().subscribe(data =>{
      for (let k in data) {
        if (data.hasOwnProperty(k)) {

        for(let s in data[k]){
          if(data[k].hasOwnProperty(s)){
            if(s === 'startTime'){
              data[k].startTime = new Date(data[k].startTime);
            }
            if(s === 'endTime'){
            
              data[k].endTime = new Date(data[k].endTime);
            }
  
          }
        }
        this.eventSource.push(data[k]);
        }
      }
      this.myCal.loadEvents();
    });
    this.resetEvent();

    this.user = this.authService.user;
  }



  async presentModal(event: Event) {
    let startTime = new Date(event.startTime).toISOString();
    let endTime = new Date(event.endTime).toISOString();
    const modal = await this.modalController.create({
      component: EditEventPage,
      componentProps: { 
        evnt: event,
        startTime: startTime,
        endTime: endTime
      }
    });
    modal.onDidDismiss()
    .then((data) => {
      this.loadEvents();
  });
    return await modal.present();
  }


 
  resetEvent() {
    this.event = {
      id: '',
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
      employees: []
    };
  }
 
  // Create the right event format and reload source
  addEvent() {
    const start = new Date(this.event.startTime).getTime();
    const end = new Date(this.event.endTime).getTime();
    if(end < start){
      return;
    }
    let id = this.fireb.createPushId();
    let eventCopy = {
      id: id,
      title: this.event.title,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }
  
 
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    
    }
    let myCopy = {
      id: id,
      title: this.event.title, 
      startTime: eventCopy.startTime.toISOString(),
      endTime: eventCopy.endTime.toISOString(),
      allDay: this.event.allDay,
      desc: this.event.desc,
      isCanceled: false
    }
    
    this.eventSource.push(eventCopy);
  
    this.fireb.object(`events/${id}`).set(myCopy);
    this.presentToast('New event created!');
    this.myCal.loadEvents();
    this.resetEvent();
  }

  // Change current month/week/day
 next() {
  var swiper = document.querySelector('.swiper-container')['swiper'];
  swiper.slideNext();
  
  
}
 
back() {
  var swiper = document.querySelector('.swiper-container')['swiper'];
  swiper.slidePrev();
}
 
// Change between month/week/day
changeMode(mode) {
  this.calendar.mode = mode;
}
 
// Focus today
today() {
  this.calendar.currentDate = new Date();
}
 
// Selected date reange and hence title changed
onViewTitleChanged(title) {
  this.viewTitle = title;
}
 
// Calendar event was clicked
async onEventSelected(event: Event) {
  // Use Angular date pipe for conversion
  //get event everytime so you can see who booked when!
  console.log(event);
  let start = formatDate(event.startTime, 'medium', this.locale);
  let end = formatDate(event.endTime, 'medium', this.locale);
 
  let list = '';
  let myEvent: Event = {
    id: event.id,
    title:  event.title,
    desc: event.desc,
    allDay:  event.allDay,
    startTime: event.startTime,
    endTime : event.endTime,
  }
  if(!event.employees){
    myEvent.employees = [];
  }else{
    myEvent.employees = event.employees;
    list +='<br/> Attending users: <br/>';
    event.employees.forEach(element => {
      list += '<h5>'+element.firstName +' ' + element.lastName + '</h5>';
    });

  }

  let isThere = false;
  if(event.employees){
  event.employees.forEach(element => {
    if(this.user.uid === element.uid){
      isThere = true;
    }
  });
}
  if(this.user.isAdmin){
    const alert = await this.alertCtrl.create({
      header: event.isCanceled ? event.title + '(CANCELED)': event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end + '' + list,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
      
          }
        }, 
        {
          text: event.isCanceled? 'Uncancel event' : 'Cancel event',
          handler: () =>{
            this.presentToast(event.title + ' updated');
            this.cancelEvent(event.id, event.isCanceled);
            event.isCanceled = !event.isCanceled;
          }
        },
        {
          text: 'Edit',
          handler: () =>{
            this.presentModal(event);
          }
        }
      ]
    });
    alert.present();
  }else{
  const alert = await this.alertCtrl.create({
    header: event.isCanceled ? event.title + '(CANCELED)': event.title,
    subHeader: event.desc,
    message: 'From: ' + start + '<br><br>To: ' + end,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
    
        }
      },
      {
        text: isThere? "Unbook": "Book",
        handler: () => {
          if(event.isCanceled){
            this.presentToast('Event is cancelled!');
            return;
          }
          if(!isThere){
            let change = this.eventSource.find(element =>{
              return element === event;
          });
          
          if(change && !change.employees){
            change.employees = [];
          }
            this.presentToast('You singed up for ' + event.title + ' event!');
            change.employees.push(this.user);
            this.fireb.object(`events/${event.id}/employees`).set(change.employees);
          }else{
            this.presentToast('You opt out from ' + event.title + ' event!');

            let exchange = myEvent.employees.filter( u =>{
							return u.uid !== this.user.uid;
            });
            myEvent.employees = exchange;
            event.employees = exchange;
            this.fireb.object(`events/${event.id}/employees`).set(myEvent.employees);
          }
        }
      }
    ]
  });
  alert.present();
}
}


 
// Time slot was clicked
onTimeSelected(ev) {
  let selected = new Date(ev.selectedTime);
  this.event.startTime = selected.toISOString();
  selected.setHours(selected.getHours() + 1);
  this.event.endTime = (selected.toISOString());
}

getData(){
  return this.http.get(`https://westparkexpress-910c4.firebaseio.com/events.json?auth=${this.authService.user.tokenId}`);
}



cancelEvent(id, status){
  console.log(id);
  this.fireb.object(`events/${id}/isCanceled`).set(!status);
}

async presentToast(information: string) {
  const toast = await this.toastCtrl.create({
    message: information,
    duration: 2000
  });
  toast.present();
}

}
