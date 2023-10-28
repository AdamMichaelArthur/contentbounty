import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateKeywordComponent } from './create-keyword.component';

describe('CreateKeywordComponent', () => {
  let component: CreateKeywordComponent;
  let fixture: ComponentFixture<CreateKeywordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateKeywordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
