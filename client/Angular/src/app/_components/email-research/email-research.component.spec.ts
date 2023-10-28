import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailResearchComponent } from './email-research.component';

describe('EmailResearchComponent', () => {
  let component: EmailResearchComponent;
  let fixture: ComponentFixture<EmailResearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
