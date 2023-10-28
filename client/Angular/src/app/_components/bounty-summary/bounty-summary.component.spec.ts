
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BountySummaryComponent } from './bounty-summary.component';

describe('BountySummaryComponent', () => {
  let component: BountySummaryComponent;
  let fixture: ComponentFixture<BountySummaryComponent>;

  beforeEach(waitForAsync(()  => {
    TestBed.configureTestingModule({
      declarations: [ BountySummaryComponent ]
    }) 
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BountySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
