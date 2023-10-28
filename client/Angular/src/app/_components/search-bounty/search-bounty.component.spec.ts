import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchBountyComponent } from './search-bounty.component';

describe('SearchBountyComponent', () => {
  let component: SearchBountyComponent;
  let fixture: ComponentFixture<SearchBountyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBountyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBountyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
