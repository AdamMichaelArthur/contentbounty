import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompetitorsComponent } from './competitors.component';

describe('CompetitorsComponent', () => {
  let component: CompetitorsComponent;
  let fixture: ComponentFixture<CompetitorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
