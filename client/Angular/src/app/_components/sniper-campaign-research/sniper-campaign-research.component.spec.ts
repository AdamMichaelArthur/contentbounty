import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SniperCampaignResearchComponent } from './sniper-campaign-research.component';

describe('SniperCampaignResearchComponent', () => {
  let component: SniperCampaignResearchComponent;
  let fixture: ComponentFixture<SniperCampaignResearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SniperCampaignResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SniperCampaignResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
