import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadReferringDomainsComponent } from './upload-referring-domains.component';

describe('UploadReferringDomainsComponent', () => {
  let component: UploadReferringDomainsComponent;
  let fixture: ComponentFixture<UploadReferringDomainsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadReferringDomainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadReferringDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
