import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KickbackComponent } from './kickback.component';

describe('KickbackComponent', () => {
  let component: KickbackComponent;
  let fixture: ComponentFixture<KickbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KickbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KickbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
