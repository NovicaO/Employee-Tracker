import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookedEventsPage } from './booked-events.page';

describe('BookedEventsPage', () => {
  let component: BookedEventsPage;
  let fixture: ComponentFixture<BookedEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookedEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookedEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
