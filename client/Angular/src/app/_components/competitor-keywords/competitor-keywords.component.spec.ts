import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompetitorKeywordsComponent } from './competitor-keywords.component';

describe('CompetitorKeywordsComponent', () => {
  let component: CompetitorKeywordsComponent;
  let fixture: ComponentFixture<CompetitorKeywordsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitorKeywordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitorKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
