import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentExplorerComponent } from './content-explorer.component';

describe('ContentExplorerComponent', () => {
  let component: ContentExplorerComponent;
  let fixture: ComponentFixture<ContentExplorerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
