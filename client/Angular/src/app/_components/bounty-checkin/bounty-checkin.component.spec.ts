import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BountyCheckinComponent } from './bounty-checkin.component';

describe('BountyCheckinComponent', () => {
  let component: BountyCheckinComponent;
  let fixture: ComponentFixture<BountyCheckinComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BountyCheckinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BountyCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
