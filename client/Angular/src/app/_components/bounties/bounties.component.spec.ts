import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BountiesComponent } from './bounties.component';

describe('BountiesComponent', () => {
  let component: BountiesComponent;
  let fixture: ComponentFixture<BountiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BountiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BountiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
