import { TestBed } from '@angular/core/testing';

import { BountyDetailService } from './bounty-detail.service';

describe('BountyDetailService', () => {
  let service: BountyDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BountyDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
