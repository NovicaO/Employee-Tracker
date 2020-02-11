import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { ModalController } from '@ionic/angular';

import {take} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ClockInService } from 'src/app/employee/clock-in/clock-in.service';
import { Data } from 'src/app/employee/clock-in/data.model';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, AfterViewInit {
  

  datum = new Subject<Date>();
  fullDate;
  currentDate;
  currentDateCompare = new Date();


  showStartLatLng = true;

  clockInHistory = [];
  map;
  googleMaps;
  passData;
  @ViewChild('map',{static: false}) mapElementRef: ElementRef;
  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private clockInService: ClockInService
  ) {}

  emitDate(data){
    this.datum.next(data);
  }

 


  ngOnInit() {
    this.showStartLatLng = this.passData;
    this.currentDate = new Date();
    this.fullDate = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
    this.datum.subscribe( datum => {
      this.fullDate = datum.getFullYear() + '-' + (datum.getMonth() + 1) + '-' + datum.getDate();
    });
    this.clockInService.clockInData.subscribe(data => {
      this.clockInHistory = [];
      for (let k in data) {
        if (data.hasOwnProperty(k)) {
          for(let j in data[k]){
            if(data[k].hasOwnProperty(j)){
             this.clockInHistory.push(data[k][j]);
            }
          }
        }
      }
      this.addMarkerWithInfo();
    });



  
  }

  ngAfterViewInit() {
    this.clockInService.getDataForDay().pipe(take(1)).subscribe(data => {
      for (let k in data) {
        if (data.hasOwnProperty(k)) {
          for(let j in data[k]){
            this.clockInHistory.push(data[k][j]);
          }
        }
      }
      this.getGoogleMaps()
      .then(googleMaps => {
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.maps.Map(mapEl, {
          center: { lat:37.567598 , lng: -122.274945 },
          zoom: 10
        });
        this.googleMaps = googleMaps;
        this.map = map;
        this.addMarkerWithInfo();
        googleMaps.maps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
    }).catch(err => {
      console.log(err);
    });
  });
  }


  previousDay(){
 
    this.currentDate.setDate(this.currentDate.getDate()-1);
    this.emitDate(this.currentDate);
    this.clockInService.getLatestClockInForDay(this.fullDate);
  }

  nextDay(){

    this.currentDate.setDate(this.currentDate.getDate()+1);
    this.emitDate(this.currentDate);

    this.clockInService.getLatestClockInForDay(this.fullDate);

  }

  markersArray = [];
  circleArray= [];

  addMarkerWithInfo(){
    this.removeMarkers();
    let lat;
    let lng;
    let address;
    let accuracy;
    let element: Data;
    let time;

    if(typeof this.showStartLatLng =='undefined'){
      this.showStartLatLng = true;
    }

    for (let k in this.clockInHistory) {
      if (this.clockInHistory.hasOwnProperty(k)) {
      element = this.clockInHistory[k];
      if(this.showStartLatLng){
        lat = element.startLat;
        lng = element.startLng;
        accuracy = element.accuracyIn;
        time = element.startTime;
      }else{
        lat = element.endLat;
        lng = element.endLng;
        accuracy = element.accuracyOut;
        time = element.endTime;
      }
      let marker = new this.googleMaps.maps.Marker({
        position: {  lat: lat , lng: lng },
        // content: this.clockInHistory
      });
      

      // this is new!
      var circle = new this.googleMaps.maps.Circle({
        map: this.map,
        radius: accuracy,    // 10 miles in metres
        fillColor: '#AA0000'
      });
      circle.bindTo('center', marker, 'position');


      this.circleArray.push(circle);
      this.markersArray.push(marker);
      let infoWindow = new this.googleMaps.maps.InfoWindow({
        content: element.userName + ' logged in at ' + time
      });
      marker.addListener('click', function(){
        infoWindow.open(this.map, marker);
      });
      marker.setMap(this.map);

   }
  }
}

removeMarkers(){
  for (let i = 0; i < this.markersArray.length; i++ ) {
    this.markersArray[i].setMap(null);
  }
  for (let i = 0; i < this.circleArray.length; i++ ) {
    this.circleArray[i].setMap(null);
  }
  this.circleArray.length = 0;
}

  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCgWD6kj33gXXJOVWQQT4alNxJ1LNj5txM';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }

  //get data for specific day
  getDataForSpecificDay(){
    // this.clockInService.getDataForSpecificDay();
  }
}
