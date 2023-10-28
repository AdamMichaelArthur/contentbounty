import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiteadminAuthoritiesComponent } from './siteadmin-authorities.component';

describe('SiteadminAuthoritiesComponent', () => {
  let component: SiteadminAuthoritiesComponent;
  let fixture: ComponentFixture<SiteadminAuthoritiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteadminAuthoritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteadminAuthoritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
