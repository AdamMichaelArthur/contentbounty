import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CalendarItemComponent } from './calendar-item.component';

describe('CalendarItemComponent', () => {
  let component: CalendarItemComponent;
  let fixture: ComponentFixture<CalendarItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
