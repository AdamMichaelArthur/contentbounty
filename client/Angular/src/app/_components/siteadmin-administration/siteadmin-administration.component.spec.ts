import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiteadminAdministrationComponent } from './siteadmin-administration.component';

describe('SiteadminAdministrationComponent', () => {
  let component: SiteadminAdministrationComponent;
  let fixture: ComponentFixture<SiteadminAdministrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteadminAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteadminAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
