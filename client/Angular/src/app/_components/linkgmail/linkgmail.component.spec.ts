import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkgmailComponent } from './linkgmail.component';

describe('LinkgmailComponent', () => {
  let component: LinkgmailComponent;
  let fixture: ComponentFixture<LinkgmailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkgmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkgmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
