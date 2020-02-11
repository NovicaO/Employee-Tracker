import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventPickComponent } from './event-pick.component';

describe('EventPickComponent', () => {
  let component: EventPickComponent;
  let fixture: ComponentFixture<EventPickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPickComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
