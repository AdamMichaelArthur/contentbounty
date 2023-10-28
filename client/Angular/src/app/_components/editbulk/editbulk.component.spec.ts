import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditbulkComponent } from './editbulk.component';

describe('EditbulkComponent', () => {
  let component: EditbulkComponent;
  let fixture: ComponentFixture<EditbulkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditbulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditbulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
