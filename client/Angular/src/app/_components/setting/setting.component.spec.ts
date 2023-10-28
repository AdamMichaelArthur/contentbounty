import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SeetingComponent } from './setting.component';

describe('SeetingComponent', () => {
  let component: SeetingComponent;
  let fixture: ComponentFixture<SeetingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
