import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiteadminHomeComponent } from './siteadmin-home.component';

describe('SiteadminCreatorsComponent', () => {
  let component: SiteadminHomeComponent;
  let fixture: ComponentFixture<SiteadminHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteadminHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteadminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
