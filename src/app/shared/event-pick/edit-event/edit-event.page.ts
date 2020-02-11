import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from '../event.model';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})

export class EditEventPage implements OnInit {


  constructor(public viewCtrl: ModalController,  private fireb: AngularFireDatabase) { }
  public evnt: Event;
  public startTime;
  public endTime;
  public oldEventTitle: Event;

  ngOnInit() {
    this.oldEventTitle = this.evnt;
  }
  dismissModal() {
    this.editEvent();
    this.viewCtrl.dismiss();
  }

  editEvent(){
    if(new Date(this.startTime).getTime() > new Date(this.endTime).getTime()){
      return;
    }
    this.evnt.startTime = this.startTime;
    this.evnt.endTime = this.endTime;
    this.fireb.object(`events/${this.evnt.id}`).set(this.evnt);

  }

}
