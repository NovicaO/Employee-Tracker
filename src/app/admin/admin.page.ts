import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, public alertController: AlertController,    private authF: AngularFireAuth) { }

  ngOnInit() {
  }


  async logout() {
    this.authService.logout();
}
}
