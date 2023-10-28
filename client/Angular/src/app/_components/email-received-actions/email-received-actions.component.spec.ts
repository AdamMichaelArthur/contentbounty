import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailReceivedActionsComponent } from './email-received-actions.component';

describe('EmailReceivedActionsComponent', () => {
  let component: EmailReceivedActionsComponent;
  let fixture: ComponentFixture<EmailReceivedActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailReceivedActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailReceivedActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
