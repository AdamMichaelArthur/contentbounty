import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailReceivedComponent } from './email-received.component';

describe('EmailReceivedComponent', () => {
  let component: EmailReceivedComponent;
  let fixture: ComponentFixture<EmailReceivedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
