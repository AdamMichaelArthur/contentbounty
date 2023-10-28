import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HaroComponent } from './haro.component';

describe('HaroComponent', () => {
  let component: HaroComponent;
  let fixture: ComponentFixture<HaroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HaroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HaroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
