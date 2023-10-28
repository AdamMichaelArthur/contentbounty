import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SniperEmailsComponent } from './sniper-emails.component';

describe('SniperEmailsComponent', () => {
  let component: SniperEmailsComponent;
  let fixture: ComponentFixture<SniperEmailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SniperEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SniperEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
