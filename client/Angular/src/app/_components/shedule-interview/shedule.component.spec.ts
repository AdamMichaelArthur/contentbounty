import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SheduleInterviewComponent } from './shedule.component';

describe('SheduleInterviewComponent', () => {
  let component: SheduleInterviewComponent;
  let fixture: ComponentFixture<SheduleInterviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SheduleInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheduleInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
