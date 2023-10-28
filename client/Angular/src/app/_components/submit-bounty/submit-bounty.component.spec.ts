import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubmitBountyComponent } from './submit-bounty.component';

describe('SubmitBountyComponent', () => {
  let component: SubmitBountyComponent;
  let fixture: ComponentFixture<SubmitBountyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitBountyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitBountyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
