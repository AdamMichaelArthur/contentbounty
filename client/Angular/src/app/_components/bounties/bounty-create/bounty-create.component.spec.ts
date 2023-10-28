import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BountyCreateComponent } from './bounty-create.component';

describe('BountyCreateComponent', () => {
  let component: BountyCreateComponent;
  let fixture: ComponentFixture<BountyCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BountyCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BountyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
