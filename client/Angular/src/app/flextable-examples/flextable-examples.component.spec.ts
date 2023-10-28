import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlextableExamplesComponent } from './flextable-examples.component';

describe('FlextableExamplesComponent', () => {
  let component: FlextableExamplesComponent;
  let fixture: ComponentFixture<FlextableExamplesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlextableExamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlextableExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
