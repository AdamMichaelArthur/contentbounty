import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BountyDetailComponent } from './bounty-detail.component';

describe('BountyDetailComponent', () => {
  let component: BountyDetailComponent;
  let fixture: ComponentFixture<BountyDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BountyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BountyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
