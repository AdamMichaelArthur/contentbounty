import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WriterApplicationComponent } from './writer-application.component';

describe('WriterApplicationComponent', () => {
  let component: WriterApplicationComponent;
  let fixture: ComponentFixture<WriterApplicationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WriterApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriterApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
