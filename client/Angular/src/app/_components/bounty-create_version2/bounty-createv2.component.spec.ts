import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BountyCreateComponentv2 } from './bounty-createv2.component';

describe('BountyCreateComponentv2', () => {
  let component: BountyCreateComponentv2;
  let fixture: ComponentFixture<BountyCreateComponentv2>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BountyCreateComponentv2 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BountyCreateComponentv2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
