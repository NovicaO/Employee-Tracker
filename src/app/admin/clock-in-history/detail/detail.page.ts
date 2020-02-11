import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Data } from 'src/app/employee/clock-in/data.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  user: Data;
  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.authService.selectedUser;
  }


}
