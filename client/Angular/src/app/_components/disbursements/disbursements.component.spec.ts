import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisbursementsComponent } from './disbursements.component';

describe('DisbursementsComponent', () => {
  let component: DisbursementsComponent;
  let fixture: ComponentFixture<DisbursementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
