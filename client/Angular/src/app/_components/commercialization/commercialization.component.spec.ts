import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommercializationComponent } from './commercialization.component';

describe('CommercializationComponent', () => {
  let component: CommercializationComponent;
  let fixture: ComponentFixture<CommercializationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercializationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
