import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiteadminCreatorsComponent } from './siteadmin-creators.component';

describe('SiteadminCreatorsComponent', () => {
  let component: SiteadminCreatorsComponent;
  let fixture: ComponentFixture<SiteadminCreatorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteadminCreatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteadminCreatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
