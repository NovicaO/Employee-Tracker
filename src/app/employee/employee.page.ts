import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from '../auth/user.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit, AfterViewInit {

  public user: User;
  constructor(private authService: AuthService, private router: Router, public alertController: AlertController, private authF: AngularFireAuth) { }

  ngOnInit() {
    this.user = this.authService.user;
    console.log(this.user);
  }

  ngAfterViewInit() {

  }


  logout() {
    this.authService.logout();
}
}
