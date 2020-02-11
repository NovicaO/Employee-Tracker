import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmployeesAdministrationPage } from './employees-administration.page';

describe('EmployeesAdministrationPage', () => {
  let component: EmployeesAdministrationPage;
  let fixture: ComponentFixture<EmployeesAdministrationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesAdministrationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesAdministrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
