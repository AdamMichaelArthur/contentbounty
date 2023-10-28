import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchselectbountyComponent } from './searchselectbounty.component';

describe('SearchselectbountyComponent', () => {
  let component: SearchselectbountyComponent;
  let fixture: ComponentFixture<SearchselectbountyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchselectbountyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchselectbountyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
