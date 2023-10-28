import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentPlannerComponent } from './content-planner.component';

describe('ContentPlannerComponent', () => {
  let component: ContentPlannerComponent;
  let fixture: ComponentFixture<ContentPlannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
