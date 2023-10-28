import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadEmailProspectsComponent } from './upload-email-prospects.component';

describe('UploadEmailProspectsComponent', () => {
  let component: UploadEmailProspectsComponent;
  let fixture: ComponentFixture<UploadEmailProspectsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadEmailProspectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEmailProspectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
