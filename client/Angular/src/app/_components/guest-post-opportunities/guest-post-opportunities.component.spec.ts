import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuestPostOpportunitiesComponent } from './guest-post-opportunities.component';

describe('GuestPostOpportunitiesComponent', () => {
  let component: GuestPostOpportunitiesComponent;
  let fixture: ComponentFixture<GuestPostOpportunitiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestPostOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestPostOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
