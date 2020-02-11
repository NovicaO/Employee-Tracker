import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClockInHistoryPage } from './clock-in-history.page';

describe('ClockInHistoryPage', () => {
  let component: ClockInHistoryPage;
  let fixture: ComponentFixture<ClockInHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockInHistoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClockInHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
