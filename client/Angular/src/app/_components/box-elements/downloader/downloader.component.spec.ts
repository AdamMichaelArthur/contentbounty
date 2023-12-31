import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DownloaderComponent } from './downloader.component';

describe('DownloaderComponent', () => {
  let component: DownloaderComponent;
  let fixture: ComponentFixture<DownloaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
