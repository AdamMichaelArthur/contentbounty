import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailResponseComponent } from './email-response.component';

describe('EmailResponseComponent', () => {
  let component: EmailResponseComponent;
  let fixture: ComponentFixture<EmailResponseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
