import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddkeywordComponent } from './addkeyword.component';

describe('AddkeywordComponent', () => {
  let component: AddkeywordComponent;
  let fixture: ComponentFixture<AddkeywordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddkeywordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddkeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
