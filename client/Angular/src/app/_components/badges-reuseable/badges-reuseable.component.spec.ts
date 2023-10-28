import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BadgesReuseableComponent } from './badges-reuseable.component';

describe('BadgesReuseableComponent', () => {
  let component: BadgesReuseableComponent;
  let fixture: ComponentFixture<BadgesReuseableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgesReuseableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgesReuseableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
