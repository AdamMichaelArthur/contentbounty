import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiteadminStripeComponent } from './siteadmin-stripe.component';

describe('SiteadminStripeComponent', () => {
  let component: SiteadminStripeComponent;
  let fixture: ComponentFixture<SiteadminStripeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteadminStripeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteadminStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
