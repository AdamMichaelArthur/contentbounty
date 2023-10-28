
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BountyHistoryCardComponent } from './bounty-history-card.component';

describe('BountyHistoryCardComponent', () => {
  let component: BountyHistoryCardComponent;
  let fixture: ComponentFixture<BountyHistoryCardComponent>;

  beforeEach(waitForAsync(( ) => {
    TestBed.configureTestingModule({
      declarations: [ BountyHistoryCardComponent ]
    }) 
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BountyHistoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
