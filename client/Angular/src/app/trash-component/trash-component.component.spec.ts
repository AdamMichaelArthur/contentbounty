import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrashComponentComponent } from './trash-component.component';

describe('TrashComponentComponent', () => {
  let component: TrashComponentComponent;
  let fixture: ComponentFixture<TrashComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
