import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BountiesInProgressComponent } from './bounties-in-progress.component';

describe('BountiesInProgressComponent', () => {
  let component: BountiesInProgressComponent;
  let fixture: ComponentFixture<BountiesInProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BountiesInProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BountiesInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
