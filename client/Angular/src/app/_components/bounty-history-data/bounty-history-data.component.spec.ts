
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BountyHistoryDataComponent } from './bounty-history-data.component';

describe('BountyHistoryDataComponent', () => {
  let component: BountyHistoryDataComponent;
  let fixture: ComponentFixture<BountyHistoryDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BountyHistoryDataComponent ]
    })
    .compileComponents();
  }) ); 

  beforeEach(() => {
    fixture = TestBed.createComponent(BountyHistoryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
